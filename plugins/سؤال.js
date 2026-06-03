// *حقوق مطورة يوميلا 🛡*
// 📄 *سؤال.js*

module.exports = {
  command: ['سؤال'],
  description: '❓ يسأل سؤال عشوائي للأعضاء',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const questions = [
        "❓ ما هو حلمك الكبير؟",
        "❓ لو عندك قوة خارقة، شو بتكون؟",
        "❓ أفضل أنمي شاهدته؟",
        "❓ مين أكثر شخصية أثرت فيك؟",
        "❓ لو رجعت بالزمن، شو أول شيء بتغيره؟"
      ];
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomQuestion }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر سؤال:', err);
    }
  }
};