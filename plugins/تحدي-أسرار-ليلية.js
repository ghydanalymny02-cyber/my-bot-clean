// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أسرار_ليلية.js*

module.exports = {
  command: ['تحدي أسرار ليلية'],
  description: '🌌 يعطي سر ليلي ويطلب تفسيره',
  category: 'games',

  async execute(sock, msg) {
    try {
      const secrets = [
        "🌌 في الليل تُكشف الهيبة.",
        "🌌 المزروفية تزداد قوة بعد منتصف الليل.",
        "🌌 الفخامة تُضيء في العتمة."
      ];
      const randomSecret = secrets[Math.floor(Math.random() * secrets.length)];

      const infoText = `
🌌 تحدي الأسرار الليلية بدأ!
اشرحوا هذا السر: ${randomSecret}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أسرار ليلية:', err);
    }
  }
};