// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_كلمة_سحرية.js*

module.exports = {
  command: ['تحدي كلمة سحرية'],
  description: '✨ يعطي كلمة سحرية ويطلب جملة بها',
  category: 'games',

  async execute(sock, msg) {
    try {
      const words = ["أسطورة", "هيبة", "مزروفية", "فخامة"];
      const randomWord = words[Math.floor(Math.random() * words.length)];

      const infoText = `
✨ تحدي الكلمة السحرية بدأ!
اكتبوا جملة تحتوي على كلمة: ${randomWord}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي كلمة سحرية:', err);
    }
  }
};