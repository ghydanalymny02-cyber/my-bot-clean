// *حقوق مطورة يوميلا 🛡*
// 📄 *أسرع.js*

module.exports = {
  command: ['أسرع'],
  description: '⚡ لعبة من يرد أولًا يفوز',
  category: 'games',

  async execute(sock, msg) {
    try {
      const challenges = [
        "⚡ اكتب كلمة: ❄ مجــهــول ❄",
        "⚡ أرسل إيموجي 🔥",
        "⚡ اكتب: أنا المزروف",
        "⚡ أرسل الرقم 777"
      ];
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

      const infoText = `
🎮 لعبة الأسرع بدأت!
${randomChallenge}

✨ « أسرع… أمر يضيف جو من التحدي والمرح داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر أسرع:', err);
    }
  }
};