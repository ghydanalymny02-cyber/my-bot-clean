// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_إبداع.js*

module.exports = {
  command: ['تحدي إبداع'],
  description: '🌟 يطلب من الأعضاء كتابة جملة إبداعية',
  category: 'games',

  async execute(sock, msg) {
    try {
      const prompts = [
        "🌟 اكتبوا جملة تبدأ بكلمة (هيبة).",
        "🌟 اكتبوا جملة تحتوي على كلمة (مزروف).",
        "🌟 اكتبوا جملة تنتهي بكلمة (فخامة)."
      ];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

      const infoText = `
🌟 تحدي الإبداع بدأ!
${randomPrompt}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي إبداع:', err);
    }
  }
};