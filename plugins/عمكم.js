const { isElite } = require('../haykala/elite');

module.exports = {
  command: 'عمكم',
  category: 'fun',
  description: 'رد ساخر للنخبة فقط',

  async execute(sock, msg, args = []) {
    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, { text: '❌ هذا الأمر يعمل فقط في المجموعات.' }, { quoted: msg });
    }

    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;

    if (!isElite(sender)) {
      return sock.sendMessage(chatId, { text: '❌ هذا الأمر مخصص لأعضاء النخبة فقط.' }, { quoted: msg });
    }

    return sock.sendMessage(chatId, { text: '❄ *〘•𝑼𝑵𝑪𝑳𝑬 𝒀𝑼𝑴𝑰𝑳𝑨•〙 ❄*' }, { quoted: msg });
  }
};