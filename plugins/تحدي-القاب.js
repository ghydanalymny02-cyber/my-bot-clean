// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_ألقاب.js*

module.exports = {
  command: ['تحدي ألقاب'],
  description: '👑 يعطي لقب ويطلب من الأعضاء وصفه',
  category: 'games',

  async execute(sock, msg) {
    try {
      const titles = ["ملك الهيبة", "مزروف الأعظم", "سيد الفخامة", "النادر العظيم"];
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];

      const infoText = `
👑 تحدي الألقاب بدأ!
اشرحوا معنى هذا اللقب: ${randomTitle}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي ألقاب:', err);
    }
  }
};