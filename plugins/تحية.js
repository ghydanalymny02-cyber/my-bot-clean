// *حقوق مطورة يوميلا 🛡*
// 📄 *تحية.js*

module.exports = {
  command: ['تحية'],
  description: '🙌 يرسل تحية فخمة للأعضاء',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const greetings = [
        "🙌 تحية الهيبة للجميع!",
        "🙌 تحية الفخامة لأعضاء القروب!",
        "🙌 تحية المزروفين الأعظم!",
        "🙌 تحية يوميلا الملكية!"
      ];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomGreeting }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحية:', err);
    }
  }
};