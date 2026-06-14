const fs = require('fs');
const { join } = require('path');

module.exports = {
  command: 'mnn',
  description: '📢 منشن جماعي لكل أعضاء الجروب',
  usage: '.mnn',
  category: 'group',

  async execute(sock, msg, args = []) {
    try {
      const groupJid = msg.key.remoteJid;
      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, {
          text: '🚫 هذا الأمر يعمل فقط داخل *المجموعات*.'
        }, { quoted: msg });
      }

      const metadata = await sock.groupMetadata(groupJid);
      const participants = metadata.participants;
      const mentions = participants.map(p => p.id);
      const groupName = metadata.subject;
      const memberCount = participants.length;

      // 🖼️ صورة من resources/7ARB.jpg
      const imageBuffer = fs.readFileSync(join(process.cwd(), 'resources', 'escanor.jpg'));

      // 👤 اللي عمل الأمر
      const senderId = (msg.participant || msg.key.participant || msg.key.remoteJid).split('@')[0];

      // ⏰ التاريخ والوقت
      const now = new Date();
      const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      const date = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

      // ✍️ بناء رسالة المنشن
      const memberLines = participants.map((p, i) => `➤ ${i + 1}. @${p.id.split('@')[0]}`).join('\n');

      const caption = `
📢 *منشن جماعي لكل الأعضاء* 🍷

╭━━〔 🛡️ *${groupName}* 🛡️ 〕━━╮
📊 *عدد الأعضاء:* ${memberCount}
📅 *التاريخ:* ${date}
⏰ *الوقت:* ${time}
👑 *تم بواسطة:* @${senderId}
╰━━━━━━━━━━━━━━━━╯

👥 *الأعضاء:*
${memberLines}
`.trim();

      await sock.sendMessage(groupJid, {
        image: imageBuffer,
        caption,
        mentions
      }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر mnn:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n\`\`\`${err.message || err.toString()}\`\`\``
      }, { quoted: msg });
    }
  }
};