// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_جملة_غامضة.js*

module.exports = {
  command: ['تحدي جملة غامضة'],
  description: '🌌 يعطي كلمة ويطلب جملة غامضة بها',
  category: 'games',

  async execute(sock, msg) {
    try {
      const words = ["ليل", "سر", "حلم", "مزروف"];
      const randomWord = words[Math.floor(Math.random() * words.length)];

      const infoText = `
🌌 تحدي الجملة الغامضة بدأ!
اكتبوا جملة غامضة تحتوي على كلمة: ${randomWord}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي جملة غامضة:', err);
    }
  }
};