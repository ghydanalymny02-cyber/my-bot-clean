// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أسرار.js*

module.exports = {
  command: ['تحدي أسرار'],
  description: '🤫 يعطي سر غامض ويطلب تفسيره',
  category: 'games',

  async execute(sock, msg) {
    try {
      const secrets = [
        "🤫 هناك باب لا يُفتح إلا بالهيبة.",
        "🤫 المزروفية تخفي قوة لا يعرفها أحد.",
        "🤫 الفخامة سرها في الصمت."
      ];
      const randomSecret = secrets[Math.floor(Math.random() * secrets.length)];

      const infoText = `
🤫 تحدي الأسرار بدأ!
اشرحوا هذا السر: ${randomSecret}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أسرار:', err);
    }
  }
};