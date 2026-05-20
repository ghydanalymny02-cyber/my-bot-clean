// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام_شجاعة.js*

module.exports = {
  command: ['وسام شجاعة'],
  description: '🛡 يمنح وسام الشجاعة لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["🛡 وسام الشجاعة الأعظم", "🛡 وسام القوة الملكية", "🛡 وسام الجرأة النادرة"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
🛡 وسام شجاعة لـ ${target}:
${randomMedal}

✨ « وسام شجاعة… أمر يمنح لقب بطولي للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام شجاعة:', err);
    }
  }
};