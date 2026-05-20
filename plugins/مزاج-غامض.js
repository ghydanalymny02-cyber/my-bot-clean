// *حقوق مطورة يوميلا 🛡*
// 📄 *مزاج_غامض.js*

module.exports = {
  command: ['مزاج غامض'],
  description: '🌌 يعطي حالة مزاجية غامضة لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const moods = [
        "🌌 مزاجك اليوم: غامض كالليل.",
        "🌌 مزاجك اليوم: نادر كالنجوم.",
        "🌌 مزاجك اليوم: فخم كالعرش.",
        "🌌 مزاجك اليوم: مزروف بلا تفسير."
      ];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomMood }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر مزاج غامض:', err);
    }
  }
};