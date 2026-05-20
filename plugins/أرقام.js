// *حقوق مطورة يوميلا 🛡*
// 📄 *أرقام.js*

module.exports = {
  command: ['أرقام'],
  description: '🔢 يعطي رقم ويطلب عملية حسابية سريعة',
  category: 'games',

  async execute(sock, msg) {
    try {
      const numbers = [5, 7, 9, 12, 15];
      const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];

      const infoText = `
🔢 لعبة الأرقام بدأت!
احسب: ${randomNumber} × 2

✨ « أرقام… أمر يضيف جو من الذكاء والسرعة داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر أرقام:', err);
    }
  }
};