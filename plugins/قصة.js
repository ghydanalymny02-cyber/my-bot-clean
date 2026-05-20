// *حقوق مطورة يوميلا 🛡*
// 📄 *قصة.js*

module.exports = {
  command: ['قصة'],
  description: '📖 يروي قصة قصيرة عشوائية',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const stories = [
        "📖 في يوم من الأيام، ظهر المزروف الأعظم في القروب وأعلن نفسه ملك الهيبة.",
        "📖 كان هناك شخص نادر، كل كلمة منه كانت فخامة مطلقة.",
        "📖 اجتمع المزروفون في ليلة غامضة، وقرروا أن يختاروا ملكًا جديدًا للفخامة."
      ];
      const randomStory = stories[Math.floor(Math.random() * stories.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomStory }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر قصة:', err);
    }
  }
};