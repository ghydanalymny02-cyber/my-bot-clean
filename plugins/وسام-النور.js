// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام_النور.js*

module.exports = {
  command: ['وسام النور'],
  description: '✨ يمنح وسام النور لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["✨ وسام النور الأعظم", "✨ وسام المزروفية المضيئة", "✨ وسام الهيبة الذهبية"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
✨ وسام النور لـ ${target}:
${randomMedal}

« وسام النور… يمنح لقب مشرق ملكي للأعضاء المميزين. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام النور:', err);
    }
  }
};