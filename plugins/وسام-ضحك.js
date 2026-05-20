// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام_ضحك.js*

module.exports = {
  command: ['وسام ضحك'],
  description: '🤣 يمنح وسام الضحك لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["🤣 وسام الضحك الأعظم", "🤣 وسام المزحة الملكية", "🤣 وسام الكوميديا النادرة"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
🤣 وسام ضحك لـ ${target}:
${randomMedal}

✨ « وسام ضحك… أمر يمنح لقب كوميدي للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام ضحك:', err);
    }
  }
};