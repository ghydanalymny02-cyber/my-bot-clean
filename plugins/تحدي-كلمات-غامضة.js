// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_كلمات_غامضة.js*

module.exports = {
  command: ['تحدي كلمات غامضة'],
  description: '🌀 يعطي كلمة غامضة ويطلب جملة بها',
  category: 'games',

  async execute(sock, msg) {
    try {
      const words = ["سرمدي", "مزروفية", "هيبة", "فخامة"];
      const randomWord = words[Math.floor(Math.random() * words.length)];

      const infoText = `
🌀 تحدي الكلمات الغامضة بدأ!
اكتبوا جملة تحتوي على كلمة: ${randomWord}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي كلمات غامضة:', err);
    }
  }
};