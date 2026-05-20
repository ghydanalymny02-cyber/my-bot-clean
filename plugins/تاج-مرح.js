// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_مرح.js*

module.exports = {
  command: ['تاج مرح'],
  description: '👑 يمنح تاج المرح لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["👑 تاج المرح الأعظم", "👑 تاج المزحة الملكية", "👑 تاج الضحك النادر"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
👑 تاج مرح لـ ${target}:
${randomCrown}

✨ « تاج مرح… أمر يمنح لقب ملكي كوميدي للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج مرح:', err);
    }
  }
};