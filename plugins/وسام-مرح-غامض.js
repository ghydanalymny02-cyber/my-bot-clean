// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام_مرح_غامض.js*

module.exports = {
  command: ['وسام مرح غامض'],
  description: '🎭 يمنح وسام المرح الغامض لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["🎭 وسام المرح الغامض الأعظم", "🎭 وسام المزحة الغامضة", "🎭 وسام الضحك السري"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
🎭 وسام مرح غامض لـ ${target}:
${randomMedal}

✨ « وسام مرح غامض… أمر يمنح لقب كوميدي غامض للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام مرح غامض:', err);
    }
  }
};