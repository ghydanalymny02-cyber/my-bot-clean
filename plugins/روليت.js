module.exports = {
  category: 'tools',
  command: 'روليت',
  description: 'لعبة الروليت الروسية - حظك يحكم!',
  async execute(sock, msg) {
    const chambers = 6;
    const bullet = Math.floor(Math.random() * chambers) + 1;
    const spin = Math.floor(Math.random() * chambers) + 1;
    
    if (bullet === spin) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `💥 *بووم!* \nالرصاصة كانت في الخانة ${bullet}\n💀 لقد خسرت!`
      }, { quoted: msg });
    } else {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `✅ *نجوت!* \nالرصاصة كانت في الخانة ${bullet}\nالدوران كان على ${spin}\n🎉 أنت محظوظ!`
      }, { quoted: msg });
    }
  }
};