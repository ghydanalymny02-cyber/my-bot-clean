// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج.js*

module.exports = {
  command: ['تاج'],
  description: '👑 يضع تاج فخامة لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["👑 ملك الهيبة", "👑 ملك الفخامة", "👑 ملك المزروفين"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
👑 تاج ${target}:
${randomCrown}

✨ « تاج… أمر يمنح لقب ملكي للأعضاء بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج:', err);
    }
  }
};