// *حقوق مطورة يوميلا 🛡*
// 📄 *حكمة_غامضة.js*

module.exports = {
  command: ['حكمة غامضة'],
  description: '🌌 يرسل حكمة غامضة للتأمل',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const wisdoms = [
        "🌌 من يعرف سره، يملك قوته.",
        "🌌 الهيبة في الصمت، والفخامة في الغموض.",
        "🌌 المزروفية ليست ضعفًا، بل بداية الأسطورة.",
        "🌌 كل نهاية هي بداية جديدة."
      ];
      const randomWisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomWisdom }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر حكمة غامضة:', err);
    }
  }
};