// *حقوق مطورة يوميلا 🛡*
// 📄 *ذاكرة.js*

module.exports = {
  command: ['ذاكرة'],
  description: '🧠 يعطي كلمة ويطلب من الأعضاء تكرارها بعد دقيقة',
  category: 'games',

  async execute(sock, msg) {
    try {
      const words = ["هيبة", "فخامة", "مزروف", "ولاء", "ندرة"];
      const randomWord = words[Math.floor(Math.random() * words.length)];

      const infoText = `
🧠 لعبة الذاكرة بدأت!
تذكروا هذه الكلمة: ${randomWord}
↪ بعد دقيقة، اكتبوا الكلمة بسرعة!

✨ « ذاكرة… أمر يضيف جو من التركيز والتحدي داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر ذاكرة:', err);
    }
  }
};