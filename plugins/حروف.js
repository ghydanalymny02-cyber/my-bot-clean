// *حقوق مطورة يوميلا 🛡*
// 📄 *حروف.js*

module.exports = {
  command: ['حروف'],
  description: '🔤 يعطي حرف ويطلب كلمة تبدأ به',
  category: 'games',

  async execute(sock, msg) {
    try {
      const letters = ["م", "ز", "ف", "ح", "ي", "ل"];
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];

      const infoText = `
🔤 لعبة الحروف بدأت!
اكتب كلمة تبدأ بحرف: ${randomLetter}

✨ « حروف… أمر يضيف جو من الذكاء والتحدي داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر حروف:', err);
    }
  }
};