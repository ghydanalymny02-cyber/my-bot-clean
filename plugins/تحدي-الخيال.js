// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_الخيال.js*

module.exports = {
  command: ['تحدي الخيال'],
  description: '🌌 يعطي مشهد خيالي ويطلب من الأعضاء وصفه أو تكملته',
  category: 'games',

  async execute(sock, msg) {
    try {
      const scenes = [
        "🌌 مدينة معلقة في السماء.",
        "🌌 بحر من الضوء الأزرق.",
        "🌌 قصر من الزجاج وسط الغيوم."
      ];
      const randomScene = scenes[Math.floor(Math.random() * scenes.length)];

      const infoText = `
🌌 تحدي الخيال بدأ!
صفوا أو أكملوا هذا المشهد: ${randomScene}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي الخيال:', err);
    }
  }
};