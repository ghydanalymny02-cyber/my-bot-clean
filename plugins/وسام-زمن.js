// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام_الزمن.js*

module.exports = {
  command: ['وسام الزمن'],
  description: '⏳ يمنح وسام الزمن لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["⏳ وسام الزمن الأعظم", "⏳ وسام المزروفية الأبدية", "⏳ وسام الهيبة الخالدة"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
⏳ وسام الزمن لـ ${target}:
${randomMedal}

« وسام الزمن… يمنح لقب خالد ملكي للأعضاء المميزين. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام الزمن:', err);
    }
  }
};