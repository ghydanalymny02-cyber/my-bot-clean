// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_غامض.js*

module.exports = {
  command: ['تاج غامض'],
  description: '👑 يضع تاج غامض لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["👑 تاج الهيبة الغامضة", "👑 تاج المزروفية الأبدية", "👑 تاج الفخامة النادرة"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
👑 تاج غامض لـ ${target}:
${randomCrown}

✨ « تاج غامض… أمر يمنح لقب ملكي غامض للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج غامض:', err);
    }
  }
};