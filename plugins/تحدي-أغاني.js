// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أغاني.js*

module.exports = {
  command: ['تحدي أغاني'],
  description: '🎶 يعطي كلمة ويطلب بيت غنائي بها',
  category: 'games',

  async execute(sock, msg) {
    try {
      const words = ["حب", "ليل", "قلب", "حلم"];
      const randomWord = words[Math.floor(Math.random() * words.length)];

      const infoText = `
🎶 تحدي الأغاني بدأ!
اكتبوا بيت غنائي يحتوي على كلمة: ${randomWord}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أغاني:', err);
    }
  }
};