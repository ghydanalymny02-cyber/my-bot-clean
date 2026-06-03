// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أرقام_مضاعفة.js*

module.exports = {
  command: ['تحدي أرقام مضاعفة'],
  description: '🔢 يعطي رقم ويطلب مضاعفته',
  category: 'games',

  async execute(sock, msg) {
    try {
      const numbers = [2, 5, 8, 11, 20];
      const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];

      const infoText = `
🔢 تحدي الأرقام المضاعفة بدأ!
ما هو ضعف الرقم: ${randomNumber}؟
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أرقام مضاعفة:', err);
    }
  }
};