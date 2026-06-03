// *حقوق مطورة يوميلا 🛡*
// 📄 *مزحة_غامضة.js*

module.exports = {
  command: ['مزحة غامضة'],
  description: '😂🌀 يرسل نكتة غامضة أو سريالية',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const jokes = [
        "😂🌀 مرة مزروف دخل القروب… وطلع ملك الهيبة بلا ما يحكي كلمة!",
        "😂🌀 يوميلا قالت: من يضحك الآن سيصبح أسطورة غدًا.",
        "😂🌀 في عالم موازي، المزروفين هم حكام الأرض."
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomJoke }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر مزحة غامضة:', err);
    }
  }
};