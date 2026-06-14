const { isElite } = require('../haykala/elite'); // تأكد من مسار ملف النخبة

module.exports = {
  command: 'وصف_الجروب',
  description: 'يعرض وصف المجموعة الحالية (للنخبة فقط)',
  category: 'group',

  async execute(sock, msg) {
    const groupJid = msg.key.remoteJid;

    if (!groupJid.endsWith('@g.us')) {
      return sock.sendMessage(groupJid, {
        text: '❌ هذا الأمر يعمل فقط داخل المجموعات.'
      }, { quoted: msg });
    }

    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isElite(sender)) {
      return sock.sendMessage(groupJid, {
        text: '❌ هذا الأمر مخصص للنخبة فقط.'
      }, { quoted: msg });
    }

    try {
      const metadata = await sock.groupMetadata(groupJid);
      const description = metadata.desc || '❌ لا يوجد وصف حالي للمجموعة.';

      await sock.sendMessage(groupJid, {
        text: `📝 *وصف المجموعة:*\n\n${description}`
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(groupJid, {
        text: `❌ فشل في جلب وصف المجموعة:\n${err.message}`
      }, { quoted: msg });
    }
  }
};