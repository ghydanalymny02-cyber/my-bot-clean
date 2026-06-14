// *حقوق مطورة يوميلا 🛡*
// 📄 *مزحة.js*

module.exports = {
  command: ['مزحة'],
  description: '😂 يرسل نكتة عشوائية',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const jokes = [
        "😂 مرة واحد راح للدكتور قاله: عندي مشكلة في النظر، قاله: طيب اجلس هناك، قاله: وين؟ قاله: هناك!",
        "🤣 مرة واحد اشترى ساعة جديدة، كل ما يشوفها يقول: يا حلاوة، الساعة بتعرف الوقت وأنا لأ!",
        "😅 مرة واحد راح ينام، لقى نفسه صاحي!"
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomJoke }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر مزحة:', err);
    }
  }
};