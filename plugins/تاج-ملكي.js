// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_ملكي.js*

module.exports = {
  command: ['تاج ملكي'],
  description: '👑 يمنح تاج ملكي لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["👑 ملك المزروفين", "👑 ملك الهيبة", "👑 ملك الفخامة"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
👑 تاج ملكي لـ ${target}:
${randomCrown}

✨ « تاج ملكي… أمر يمنح لقب أسطوري للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج ملكي:', err);
    }
  }
};