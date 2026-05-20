// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_الأرقام_المخفية.js*

module.exports = {
  command: ['تحدي الأرقام المخفية'],
  description: '🔢 يعطي معادلة فيها رقم مفقود ويطلب إيجاده',
  category: 'games',

  async execute(sock, msg) {
    try {
      const puzzles = [
        "🔢 ? + 8 = 20",
        "🔢 15 - ? = 9",
        "🔢 ? × 5 = 25"
      ];
      const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

      const infoText = `
🔢 تحدي الأرقام المخفية بدأ!
أوجدوا الرقم المفقود: ${randomPuzzle}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي الأرقام المخفية:', err);
    }
  }
};