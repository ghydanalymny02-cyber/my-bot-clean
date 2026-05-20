module.exports = {
  command: ['لعبة'],
  description: 'لعبة حجر ورقة مقص',
  category: 'ترفيه',
  async execute(sock, msg) {
    const choices = ["✊ حجر", "✋ ورقة", "✌️ مقص"];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: `🤖 اختياري: ${botChoice}` }, { quoted: msg });
  }
};