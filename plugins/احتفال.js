// *حقوق مطورة يوميلا 🛡*
// 📄 *احتفال.js*

module.exports = {
  command: ['احتفال'],
  description: '🎉 يعلن احتفال عشوائي داخل القروب',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const celebrations = [
        "🎉 اليوم هو يوم الهيبة!",
        "🎉 احتفال بالفخامة المطلقة!",
        "🎉 يوم المزروفين العظيم!",
        "🎉 يوميلا تعلن بداية الاحتفال!"
      ];
      const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];

      const infoText = `
${randomCelebration}
✨ « احتفال… أمر يضيف جو من الفرح والفخامة داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر احتفال:', err);
    }
  }
};