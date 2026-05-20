// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_حكمة.js*

module.exports = {
  command: ['تحدي حكمة'],
  description: '📜 يعطي حكمة ويطلب من الأعضاء شرحها',
  category: 'games',

  async execute(sock, msg) {
    try {
      const wisdoms = [
        "📜 الصمت أبلغ من الكلام.",
        "📜 الهيبة في الأفعال لا الأقوال.",
        "📜 المزروفية ليست ضعفًا بل بداية الأسطورة."
      ];
      const randomWisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];

      const infoText = `
📜 تحدي الحكمة بدأ!
اشرحوا هذه الحكمة: ${randomWisdom}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي حكمة:', err);
    }
  }
};