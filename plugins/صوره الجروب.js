const { isElite } = require('../haykala/elite'); // تأكد من المسار حسب مشروعك
const axios = require('axios');

module.exports = {
  command: 'صوره_الجروب',
  description: 'يعرض صورة المجموعة الحالية (للنخبة فقط)',
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
      const url = await sock.profilePictureUrl(groupJid, 'image');
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');

      await sock.sendMessage(groupJid, {
        image: buffer,
        caption: '🖼️ *صورة المجموعة الحالية*'
      }, { quoted: msg });

    } catch {
      await sock.sendMessage(groupJid, {
        text: '❌ لا توجد صورة حالية للمجموعة.'
      }, { quoted: msg });
    }
  }
};