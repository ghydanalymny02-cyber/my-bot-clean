const { isElite } = require('../haykala/elite');

module.exports = {
  command: 'اسم_الجروب',
  description: 'يعرض اسم الجروب الحالي (للنخبة فقط)',
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

    const metadata = await sock.groupMetadata(groupJid);
    await sock.sendMessage(groupJid, {
      text: `📛 *اسم المجموعة:* ${metadata.subject}`
    }, { quoted: msg });
  }
};