const { loadWarnings } = require('../lib/warns');

module.exports = {
  command: 'انذارات',
  category: 'admin',
  async execute(sock, msg, args) {
    const chatId = msg.key.remoteJid;
    let warnings = loadWarnings();
    
    if (!warnings[chatId] || Object.keys(warnings[chatId]).length === 0) 
      return sock.sendMessage(chatId, { text: '✅ لا يوجد إنذارات.' }, { quoted: msg });

    let list = `⚠️ قائمة الإنذارات:\n\n`;
    for (const [id, count] of Object.entries(warnings[chatId])) {
      if (count > 0) list += `@${id.split('@')[0]} : ${count}\n`;
    }
    await sock.sendMessage(chatId, { text: list, mentions: Object.keys(warnings[chatId]) }, { quoted: msg });
  }
};
