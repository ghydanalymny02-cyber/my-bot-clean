// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_صور.js*

module.exports = {
  command: ['تحدي صور'],
  description: '📷 يطلب من الأعضاء إرسال صورة معينة',
  category: 'games',

  async execute(sock, msg) {
    try {
      const challenges = [
        "📷 أرسل صورة آخر وجبة أكلتها.",
        "📷 أرسل صورة شيء لونه أزرق.",
        "📷 أرسل صورة مكانك الحالي."
      ];
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomChallenge }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي صور:', err);
    }
  }
};