// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_صور_ذهنية.js*

module.exports = {
  command: ['تحدي صور ذهنية'],
  description: '🌌 يعطي وصف صورة ذهنية ويطلب من الأعضاء تخيلها',
  category: 'games',

  async execute(sock, msg) {
    try {
      const visions = [
        "🌌 تخيل أنك تجلس على عرش من جليد وسط سماء مليئة بالنجوم.",
        "🌌 تخيل أنك مزروف في قصر غامض تحيط به الأضواء.",
        "🌌 تخيل أنك ملك الهيبة في مدينة من الذهب."
      ];
      const randomVision = visions[Math.floor(Math.random() * visions.length)];

      const infoText = `
🌌 تحدي الصور الذهنية بدأ!
تخيلوا هذا المشهد: ${randomVision}
↪ اكتبوا شعوركم أو وصفكم له.
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي صور ذهنية:', err);
    }
  }
};