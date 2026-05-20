// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام_النجوم.js*

module.exports = {
  command: ['وسام النجوم'],
  description: '🌟 يمنح وسام النجوم لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["🌟 وسام النجوم الأعظم", "🌟 وسام المزروفية السماوية", "🌟 وسام الهيبة الكونية"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
🌟 وسام النجوم لـ ${target}:
${randomMedal}

« وسام النجوم… يمنح لقب سماوي ملكي للأعضاء المميزين. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام النجوم:', err);
    }
  }
};