// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أرقام_سريعة.js*

module.exports = {
  command: ['تحدي أرقام سريعة'],
  description: '⚡ يعطي عملية حسابية سريعة',
  category: 'games',

  async execute(sock, msg) {
    try {
      const numbers = [3, 7, 12, 25, 50];
      const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];

      const infoText = `
⚡ تحدي الأرقام السريعة بدأ!
احسب بسرعة: ${randomNumber} + 10
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أرقام سريعة:', err);
    }
  }
};