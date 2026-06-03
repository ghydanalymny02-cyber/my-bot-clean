// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أقوال.js*

module.exports = {
  command: ['تحدي أقوال'],
  description: '📜 يعطي قول قصير ويطلب من الأعضاء تفسيره',
  category: 'games',

  async execute(sock, msg) {
    try {
      const sayings = [
        "📜 الهيبة في الصمت.",
        "📜 المزروفية بداية الأسطورة.",
        "📜 الفخامة لا تُشترى."
      ];
      const randomSaying = sayings[Math.floor(Math.random() * sayings.length)];

      const infoText = `
📜 تحدي الأقوال بدأ!
اشرحوا هذا القول: ${randomSaying}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أقوال:', err);
    }
  }
};