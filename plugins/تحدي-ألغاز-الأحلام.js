// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_ألغاز_الأحلام.js*

module.exports = {
  command: ['تحدي ألغاز الأحلام'],
  description: '🌠 يعطي لغز مرتبط بالأحلام',
  category: 'games',

  async execute(sock, msg) {
    try {
      const riddles = [
        "🌠 ما هو الشيء الذي تراه وأنت نائم لكنه يختفي عند الاستيقاظ؟ (الحلم)",
        "🌠 ما هو الشيء الذي يزورك بلا موعد؟ (الرؤيا)",
        "🌠 ما هو الشيء الذي يربطك بالخيال؟ (الأحلام)"
      ];
      const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];

      const infoText = `
🌠 تحدي ألغاز الأحلام بدأ!
${randomRiddle}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي ألغاز الأحلام:', err);
    }
  }
};