// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أحلام.js*

module.exports = {
  command: ['تحدي أحلام'],
  description: '🌠 يعطي حلم غامض ويطلب تفسيره',
  category: 'games',

  async execute(sock, msg) {
    try {
      const dreams = [
        "🌠 حلمت أنك تطير فوق قصر الهيبة.",
        "🌠 حلمت أنك مزروف في غابة غامضة.",
        "🌠 حلمت أنك ملك الفخامة بين النجوم."
      ];
      const randomDream = dreams[Math.floor(Math.random() * dreams.length)];

      const infoText = `
🌠 تحدي الأحلام بدأ!
فسروا هذا الحلم: ${randomDream}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أحلام:', err);
    }
  }
};