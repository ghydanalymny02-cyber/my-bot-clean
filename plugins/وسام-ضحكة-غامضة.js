// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام_ضحكة_غامضة.js*

module.exports = {
  command: ['وسام ضحكة غامضة'],
  description: '🤣 يمنح وسام الضحكة الغامضة لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["🤣 وسام الضحكة الغامضة الأعظم", "🤣 وسام المزحة الليلية", "🤣 وسام الكوميديا السرية"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
🤣 وسام ضحكة غامضة لـ ${target}:
${randomMedal}

✨ « وسام ضحكة غامضة… يمنح لقب كوميدي غامض للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام ضحكة غامضة:', err);
    }
  }
};