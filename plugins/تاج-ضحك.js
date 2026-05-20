// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_ضحك.js*

module.exports = {
  command: ['تاج ضحك'],
  description: '👑 يمنح تاج الضحك لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["👑 تاج الضحك الأعظم", "👑 تاج المزحة الملكية", "👑 تاج المرح النادر"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
👑 تاج ضحك لـ ${target}:
${randomCrown}

✨ « تاج ضحك… أمر يمنح لقب كوميدي ملكي للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج ضحك:', err);
    }
  }
};