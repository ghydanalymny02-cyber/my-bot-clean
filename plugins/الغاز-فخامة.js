// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_ألغاز_فخامة.js*

module.exports = {
  command: ['تحدي ألغاز فخامة'],
  description: '💎 يعطي لغز مرتبط بالفخامة',
  category: 'games',

  async execute(sock, msg) {
    try {
      const riddles = [
        "💎 ما هو الشيء الذي يزيد قيمته بالصمت؟ (الفخامة)",
        "💎 ما هو الشيء الذي يلمع بلا ضوء؟ (الهيبة)",
        "💎 ما هو الشيء الذي يُزرف بلا دم؟ (الموقف)"
      ];
      const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];

      const infoText = `
💎 تحدي ألغاز الفخامة بدأ!
${randomRiddle}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي ألغاز فخامة:', err);
    }
  }
};