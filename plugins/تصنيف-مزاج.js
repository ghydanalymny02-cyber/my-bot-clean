// *حقوق مطورة يوميلا 🛡*
// 📄 *تصنيف_مزاج.js*

module.exports = {
  command: ['تصنيف مزاج'],
  description: '🌈 يصنف مزاج العضو بشكل عشوائي',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const moods = [
        "🌈 مزاجك اليوم: ملكي 👑",
        "🌈 مزاجك اليوم: مزروف 🩸",
        "🌈 مزاجك اليوم: فخم 💎",
        "🌈 مزاجك اليوم: غامض 🌌",
        "🌈 مزاجك اليوم: مرح 😂"
      ];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomMood }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تصنيف مزاج:', err);
    }
  }
};