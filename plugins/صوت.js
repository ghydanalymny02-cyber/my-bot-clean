// *حقوق مطورة يوميلا 🛡*
// 📄 *صوت.js*

module.exports = {
  command: ['صوت'],
  description: '🎵 يوحي بصوت معين عبر النص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const sounds = [
        "🎵 صوت التصفيق يتردد في القروب!",
        "🎵 صوت المزروفين يعلو!",
        "🎵 صوت الهيبة يسيطر!",
        "🎵 صوت الفخامة يملأ المكان!"
      ];
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomSound }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر صوت:', err);
    }
  }
};