// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_سريع.js*

module.exports = {
  command: ['تحدي سريع'],
  description: '⚡ يعطي تحدي قصير وسريع للأعضاء',
  category: 'games',

  async execute(sock, msg) {
    try {
      const challenges = [
        "⚡ أرسل إيموجي يعبر عن حالتك الآن.",
        "⚡ اكتب كلمة تبدأ بحرف (ف).",
        "⚡ أرسل صورة آخر شيء أكلته."
      ];
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomChallenge }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي سريع:', err);
    }
  }
};