// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_كلمات.js*

module.exports = {
  command: ['تحدي كلمات'],
  description: '📝 يعطي كلمة ويطلب جملة بها',
  category: 'games',

  async execute(sock, msg) {
    try {
      const words = ["هيبة", "مزروف", "فخامة", "ندرة"];
      const randomWord = words[Math.floor(Math.random() * words.length)];

      const infoText = `
📝 تحدي الكلمات بدأ!
اكتبوا جملة تحتوي على كلمة: ${randomWord}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي كلمات:', err);
    }
  }
};