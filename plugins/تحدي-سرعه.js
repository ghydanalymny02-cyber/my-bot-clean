// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_سرعة.js*

module.exports = {
  command: ['تحدي سرعة'],
  description: '⚡ من يرد أولًا يفوز',
  category: 'games',

  async execute(sock, msg) {
    try {
      const challenges = [
        "⚡ اكتب كلمة (هيبة) بسرعة!",
        "⚡ أرسل إيموجي 🔥 بسرعة!",
        "⚡ اكتب رقم 99 بسرعة!"
      ];
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomChallenge }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي سرعة:', err);
    }
  }
};