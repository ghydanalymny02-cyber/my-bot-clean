// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أحرف_غامضة.js*

module.exports = {
  command: ['تحدي أحرف غامضة'],
  description: '🔤 يعطي حرف غامض ويطلب كلمة نادرة تبدأ به',
  category: 'games',

  async execute(sock, msg) {
    try {
      const letters = ["غ", "س", "ق", "ظ", "ش"];
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];

      const infoText = `
🔤 تحدي الأحرف الغامضة بدأ!
اكتبوا كلمة نادرة تبدأ بحرف: ${randomLetter}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أحرف غامضة:', err);
    }
  }
};