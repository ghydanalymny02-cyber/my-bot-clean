// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_سرعة_إيموجي.js*

module.exports = {
  command: ['تحدي سرعة إيموجي'],
  description: '⚡ يعطي إيموجي ويطلب من الأعضاء إرساله بسرعة',
  category: 'games',

  async execute(sock, msg) {
    try {
      const emojis = ["🔥", "❄️", "💎", "👑", "😂"];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      const infoText = `
⚡ تحدي سرعة الإيموجي بدأ!
أرسلوا هذا الإيموجي بسرعة: ${randomEmoji}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي سرعة إيموجي:', err);
    }
  }
};