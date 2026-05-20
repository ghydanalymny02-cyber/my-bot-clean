// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أصوات.js*

module.exports = {
  command: ['تحدي أصوات'],
  description: '🔊 يطلب من الأعضاء تقليد صوت معين بالنص',
  category: 'games',

  async execute(sock, msg) {
    try {
      const sounds = ["مواء القط 🐱", "تصفيق 👏", "ضحك 😂", "صفير 🎶"];
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];

      const infoText = `
🔊 تحدي الأصوات بدأ!
اكتبوا نصًا يقلد صوت: ${randomSound}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أصوات:', err);
    }
  }
};