// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أمثال.js*

module.exports = {
  command: ['تحدي أمثال'],
  description: '🧩 يعطي مثل ويطلب من الأعضاء إكماله',
  category: 'games',

  async execute(sock, msg) {
    try {
      const proverbs = [
        "🧩 من جد وجد، ومن…",
        "🧩 إذا كان الكلام من فضة…",
        "🧩 اليد الواحدة لا…"
      ];
      const randomProverb = proverbs[Math.floor(Math.random() * proverbs.length)];

      const infoText = `
🧩 تحدي الأمثال بدأ!
أكملوا هذا المثل: ${randomProverb}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أمثال:', err);
    }
  }
};