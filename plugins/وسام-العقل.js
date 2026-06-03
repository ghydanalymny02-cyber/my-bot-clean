// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام_العقل.js*

module.exports = {
  command: ['وسام العقل'],
  description: '🧠 يمنح وسام العقل لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["🧠 وسام العقل الأعظم", "🧠 وسام التفكير الملكي", "🧠 وسام المزروفية الذكية"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
🧠 وسام العقل لـ ${target}:
${randomMedal}

« وسام العقل… يمنح لقب ذكي ملكي للأعضاء المميزين. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام العقل:', err);
    }
  }
};