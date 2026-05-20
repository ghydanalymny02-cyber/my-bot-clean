// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_الأسرار.js*

module.exports = {
  command: ['تاج الأسرار'],
  description: '👑 يمنح تاج الأسرار لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["👑 تاج الأسرار الأعظم", "👑 تاج الغموض الملكي", "👑 تاج المزروفية السرية"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
👑 تاج الأسرار لـ ${target}:
${randomCrown}

✨ « تاج الأسرار… يمنح لقب ملكي غامض للأعضاء المميزين. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج الأسرار:', err);
    }
  }
};