// *حقوق مطورة يوميلا 🛡*
// 📄 *نهاية.js*

module.exports = {
  command: ['نهاية'],
  description: '🔚 يعطي نهاية عشوائية لقصة أو مغامرة',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const endings = [
        "🔚 انتهت القصة بتتويج المزروف ملكًا للهيبة.",
        "🔚 النهاية كانت غامضة، ولم يعرف أحد مصير البطل.",
        "🔚 انتهت المغامرة بضحكة فخمة هزت القروب."
      ];
      const randomEnding = endings[Math.floor(Math.random() * endings.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomEnding }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر نهاية:', err);
    }
  }
};