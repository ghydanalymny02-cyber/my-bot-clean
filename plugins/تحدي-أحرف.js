// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أحرف.js*

module.exports = {
  command: ['تحدي أحرف'],
  description: '🔤 يعطي حرف ويطلب كلمة غريبة تبدأ به',
  category: 'games',

  async execute(sock, msg) {
    try {
      const letters = ["م", "ز", "ف", "ح", "ي"];
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];

      const infoText = `
🔤 تحدي الأحرف بدأ!
اكتبوا كلمة غريبة تبدأ بحرف: ${randomLetter}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أحرف:', err);
    }
  }
};