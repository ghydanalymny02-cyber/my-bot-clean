// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أرقام_ملكية.js*

module.exports = {
  command: ['تحدي أرقام ملكية'],
  description: '👑 يعطي رقم ملكي ويطلب استخدامه في جملة',
  category: 'games',

  async execute(sock, msg) {
    try {
      const numbers = [99, 777, 111, 2025];
      const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];

      const infoText = `
👑 تحدي الأرقام الملكية بدأ!
اكتبوا جملة تحتوي على الرقم: ${randomNumber}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أرقام ملكية:', err);
    }
  }
};