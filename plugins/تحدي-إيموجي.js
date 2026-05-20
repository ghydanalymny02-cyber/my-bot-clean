// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_إيموجي_غامض.js*

module.exports = {
  command: ['تحدي إيموجي غامض'],
  description: '🌀 يعطي تسلسل إيموجي ويطلب تفسيره',
  category: 'games',

  async execute(sock, msg) {
    try {
      const sequences = [
        "🌀 👑 💎",
        "🌀 😂 🔥",
        "🌀 ❄️ 🩸",
        "🌀 🌌 🎉"
      ];
      const randomSequence = sequences[Math.floor(Math.random() * sequences.length)];

      const infoText = `
🌀 تحدي الإيموجي الغامض بدأ!
فسروا هذا التسلسل: ${randomSequence}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي إيموجي غامض:', err);
    }
  }
};