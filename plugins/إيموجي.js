// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡*
// 📄 *إيموجي.js*

module.exports = {
  command: ['إيموجي'],
  description: '😀 يرسل إيموجي عشوائي كرد فعل',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const emojis = ["😀", "😎", "🔥", "💎", "🥶", "😂", "❤️", "🌹", "🎉"];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      const infoText = `
😀 إيموجي عشوائي:
${randomEmoji}

✨ « إيموجي… أمر يضيف لمسة مرحة وسريعة داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر إيموجي:', err);
    }
  }
};