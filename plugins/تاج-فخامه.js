// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_فخامة.js*

module.exports = {
  command: ['تاج فخامة'],
  description: '👑 يضع تاج فخامة لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["👑 تاج الفخامة المطلقة", "👑 تاج الهيبة الملكية", "👑 تاج المزروفية النادرة"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
👑 تاج فخامة لـ ${target}:
${randomCrown}

✨ « تاج فخامة… أمر يمنح لقب ملكي للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج فخامة:', err);
    }
  }
};