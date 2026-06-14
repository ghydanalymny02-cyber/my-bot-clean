// *حقوق مطورة يوميلا 🛡*
// 📄 *خمن.js*

module.exports = {
  command: ['خمن'],
  description: '🎲 لعبة تخمين رقم بين 1 و 5',
  category: 'games',

  async execute(sock, msg) {
    try {
      const randomNumber = Math.floor(Math.random() * 5) + 1;
      const infoText = `
🎲 لعبة التخمين بدأت!
خمن رقم من 1 إلى 5…
الرقم الصحيح هو: ${randomNumber}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر خمن:', err);
    }
  }
};