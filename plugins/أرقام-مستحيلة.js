// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أرقام_مستحيلة.js*

module.exports = {
  command: ['تحدي أرقام مستحيلة'],
  description: '🧮 يعطي عملية حسابية شبه مستحيلة ويطلب محاولة حلها',
  category: 'games',

  async execute(sock, msg) {
    try {
      const puzzles = [
        "🧮 9999 ÷ ? = 111",
        "🧮 ? × 77 = 770",
        "🧮 2025 - ? = 1999"
      ];
      const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

      const infoText = `
🧮 تحدي الأرقام المستحيلة بدأ!
أوجدوا الرقم المفقود: ${randomPuzzle}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أرقام مستحيلة:', err);
    }
  }
};