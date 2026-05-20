// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_جملة.js*

module.exports = {
  command: ['تحدي جملة'],
  description: '📝 يطلب جملة تحتوي كلمة معينة',
  category: 'games',

  async execute(sock, msg) {
    try {
      const words = ["مزروف", "هيبة", "فخامة", "ندرة"];
      const randomWord = words[Math.floor(Math.random() * words.length)];

      const infoText = `
📝 تحدي الجملة بدأ!
اكتبوا جملة تحتوي على كلمة: ${randomWord}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي جملة:', err);
    }
  }
};