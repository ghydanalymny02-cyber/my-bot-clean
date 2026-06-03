// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_ألغاز_هيبة.js*

module.exports = {
  command: ['تحدي ألغاز هيبة'],
  description: '🧩 يعطي لغز مرتبط بالهيبة',
  category: 'games',

  async execute(sock, msg) {
    try {
      const riddles = [
        "🧩 ما هو الشيء الذي يمنحك الهيبة بلا كلام؟ (الصمت)",
        "🧩 ما هو الشيء الذي يرفعك بلا عرش؟ (الثقة)",
        "🧩 ما هو الشيء الذي يزرفك بلا دم؟ (الموقف)"
      ];
      const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];

      const infoText = `
🧩 تحدي ألغاز الهيبة بدأ!
${randomRiddle}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي ألغاز هيبة:', err);
    }
  }
};