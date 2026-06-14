// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أرقام_غامضة.js*

module.exports = {
  command: ['تحدي أرقام غامضة'],
  description: '🔢 يعطي رقم غامض ويطلب تفسيره',
  category: 'games',

  async execute(sock, msg) {
    try {
      const numbers = [7, 13, 42, 99];
      const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];

      const infoText = `
🔢 تحدي الأرقام الغامضة بدأ!
فسروا الرقم: ${randomNumber}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أرقام غامضة:', err);
    }
  }
};