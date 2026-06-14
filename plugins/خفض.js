const { isElite } = require('../haykala/elite');

module.exports = {
  command: 'خفض',
  category: 'tools',
  description: '🛑 خفض عضو أو أكثر من الإشراف (لأدمن الجروب)',

  async execute(sock, msg, args = []) {
    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '🚫 This command works in *groups only*!'
      }, { quoted: msg });
    }

    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;

    const groupMetadata = await sock.groupMetadata(chatId);
    const groupParticipants = groupMetadata.participants;

    // ✅ التحقق إن المرسل أدمن
    const senderData = groupParticipants.find(p => p.id === sender);
    if (!senderData || (senderData.admin !== 'admin' && senderData.admin !== 'superadmin')) {
      return sock.sendMessage(chatId, {
        text: '🚫 هذا الأمر متاح فقط لأدمن الجروب.'
      }, { quoted: msg });
    }

    // 📌 نفس طريقة "ادمن" في تحديد الهدف
    let targets = [];
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const contextParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (mentioned?.length) {
      targets.push(mentioned[0]);
    } else if (contextParticipant) {
      targets.push(contextParticipant);
    } else if (args.length) {
      targets = args.map(arg => arg.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
    } else {
      targets.push(sender);
    }

    const senderName = (await sock.onWhatsApp(sender))?.[0]?.notify || `@${sender.split('@')[0]}`;

    for (const target of targets) {
      const participant = groupParticipants.find(p => p.id === target);

      if (!participant) {
        await sock.sendMessage(chatId, {
          text: `❌ العضو غير موجود في المجموعة: ${target.replace(/@s\.whatsapp\.net$/, '')}`
        }, { quoted: msg });
        continue;
      }

      if (participant.admin !== 'admin') {
        await sock.sendMessage(chatId, {
          text: `ℹ️ ${target.replace(/@s\.whatsapp\.net$/, '')} *is not an admin.*`,
          mentions: [target]
        }, { quoted: msg });
        continue;
      }

      try {
        await sock.groupParticipantsUpdate(chatId, [target], 'demote');

        const targetName = (await sock.onWhatsApp(target))?.[0]?.notify || `@${target.split('@')[0]}`;

        const message = `
╭━━━━━━⊰⚔️⊱━━━━━━╮
┃
┃ 🖤 *User:* ${targetName}
┃ 💢 *Demoted from Admin status!*
┃
┃ ⚔️ *By:* ${senderName}
┃ ⚜️ *Your powers have faded...*
┃
╰━━━━━━⊰⚔️⊱━━━━━━╯`.trim();

        await sock.sendMessage(chatId, {
          text: message,
          mentions: [target, sender]
        }, { quoted: msg });

      } catch (error) {
        await sock.sendMessage(chatId, {
          text: `❌ *فشل الخفض:* ${target.replace(/@s\.whatsapp\.net$/, '')} – ${error.message}`
        }, { quoted: msg });
      }
    }
  }
};