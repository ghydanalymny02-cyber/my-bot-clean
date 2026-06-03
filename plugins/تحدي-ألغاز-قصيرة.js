// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_ألغاز_قصيرة.js*

module.exports = {
  command: ['تحدي ألغاز قصيرة'],
  description: '🧩 يعطي لغز قصير للأعضاء',
  category: 'games',

  async execute(sock, msg) {
    try {
      const riddles = [
        "🧩 ما هو الشيء الذي يمشي بلا قدمين؟ (الصوت)",
        "🧩 ما هو الشيء الذي يُرى في الليل فقط؟ (النجوم)",
        "🧩 ما هو الشيء الذي يكتب بلا يدين؟ (القلم)"
      ];
      const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];

      const infoText = `
🧩 تحدي الألغاز القصيرة بدأ!
${randomRiddle}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي ألغاز قصيرة:', err);
    }
  }
};