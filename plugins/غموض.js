// *حقوق مطورة يوميلا 🛡*
// 📄 *غموض.js*

module.exports = {
  command: ['غموض'],
  description: '🌌 يعطي جملة غامضة عشوائية',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mysteries = [
        "🌌 هناك سر يحيط بك لا يعرفه أحد.",
        "🌌 الهيبة التي تحملها ستكشف قريبًا.",
        "🌌 كل خطوة لك تترك أثرًا غامضًا.",
        "🌌 أنت المزروف الذي لا يُفهم بسهولة.",
        "🌌 الغموض جزء من قوتك."
      ];
      const randomMystery = mysteries[Math.floor(Math.random() * mysteries.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomMystery }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر غموض:', err);
    }
  }
};