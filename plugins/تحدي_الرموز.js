// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_الرموز.js*

module.exports = {
  command: ['تحدي الرموز'],
  description: '🔐 يعطي رمز غامض ويطلب تفسيره',
  category: 'games',

  async execute(sock, msg) {
    try {
      const symbols = ["♠️", "♣️", "♦️", "♥️"];
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

      const infoText = `
🔐 تحدي الرموز بدأ!
اشرحوا معنى هذا الرمز: ${randomSymbol}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي الرموز:', err);
    }
  }
};