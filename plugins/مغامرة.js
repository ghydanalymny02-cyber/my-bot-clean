// *حقوق مطورة يوميلا 🛡*
// 📄 *مغامرة.js*

module.exports = {
  command: ['مغامرة'],
  description: '🏹 يعطي بداية مغامرة للأعضاء ليكملوها',
  category: 'games',

  async execute(sock, msg) {
    try {
      const adventures = [
        "🏹 تبدأ المغامرة في قصر الهيبة، حيث ينتظر المزروف الأعظم قرارك.",
        "🏹 تبدأ المغامرة في غابة الفخامة، حيث يختبئ سر نادر.",
        "🏹 تبدأ المغامرة عند بوابة يوميلا، حيث عليك أن تختار طريقك."
      ];
      const randomAdventure = adventures[Math.floor(Math.random() * adventures.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomAdventure }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر مغامرة:', err);
    }
  }
};