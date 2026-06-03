// *حقوق مطورة يوميلا 🛡*
// 📄 *حلم.js*

module.exports = {
  command: ['حلم'],
  description: '🌠 يعطي حلم عشوائي لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const dreams = [
        "🌠 حلمت أنك ملك القروب اليوم.",
        "🌠 حلمت أنك المزروف الأعظم.",
        "🌠 حلمت أنك تملك قوة خارقة.",
        "🌠 حلمت أنك نادر لا مثيل لك.",
        "🌠 حلمت أنك ستصبح أسطورة."
      ];
      const randomDream = dreams[Math.floor(Math.random() * dreams.length)];

      const infoText = `
🌠 حلم ${target}:
${randomDream}

✨ « حلم… أمر يضيف لمسة غامضة ومرحة داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر حلم:', err);
    }
  }
};