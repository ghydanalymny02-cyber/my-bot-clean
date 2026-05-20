// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_جماعي.js*

module.exports = {
  command: ['تحدي جماعي'],
  description: '🎯 يعطي مهمة جماعية للأعضاء',
  category: 'games',

  async execute(sock, msg) {
    try {
      const tasks = [
        "🎯 أرسلوا جميعًا صورة من آخر شيء أكلتموه.",
        "🎯 كل عضو يكتب كلمة تبدأ بحرف (م).",
        "🎯 أرسلوا إيموجي يعبر عن حالتكم الآن."
      ];
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

      const infoText = `
🎮 تحدي جماعي بدأ الآن:
${randomTask}

✨ « تحدي جماعي… أمر يضيف جو من المرح والتفاعل داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي جماعي:', err);
    }
  }
};