// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام_ليل.js*

module.exports = {
  command: ['وسام ليل'],
  description: '🌙 يمنح وسام الليل لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["🌙 وسام الليل الأعظم", "🌙 وسام المزروف الليلي", "🌙 وسام الهيبة الليلية"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
🌙 وسام ليل لـ ${target}:
${randomMedal}

✨ « وسام ليل… أمر يمنح لقب غامض للأعضاء في أجواء الليل. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام ليل:', err);
    }
  }
};