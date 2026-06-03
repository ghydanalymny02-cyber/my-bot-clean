// *حقوق مطورة يوميلا 🛡*
// 📄 *حكمة_فنية.js*

module.exports = {
  command: ['حكمة فنية'],
  description: '🌹 يرسل حكمة مرتبطة بالفن والجمال',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const artWisdom = [
        "🌹 الفن مرآة الروح، والفخامة صدى القلب.",
        "🌹 الهيبة في اللوحة مثل الضوء في الظلام.",
        "🌹 المزروفية فنٌ بحد ذاتها، لا يفهمها إلا القليل."
      ];
      const randomWisdom = artWisdom[Math.floor(Math.random() * artWisdom.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomWisdom }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر حكمة فنية:', err);
    }
  }
};