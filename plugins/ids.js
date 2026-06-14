module.exports = {
  command: 'ids',
  description: 'يعرض معرف الجروب الحالي',
  category: 'group',
  usage: '.ids',
  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: '❗ هذا الأمر يعمل فقط في المجموعات.' }, { quoted: msg });
    }
    await sock.sendMessage(from, { text: `🆔 معرف هذا الجروب هو:\n\n${from}` }, { quoted: msg });
  }
};