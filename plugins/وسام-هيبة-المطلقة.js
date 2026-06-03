// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام_الهيبة_المطلقة.js*

module.exports = {
  command: ['وسام الهيبة المطلقة'],
  description: '👑 يمنح وسام الهيبة المطلقة لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["👑 وسام الهيبة المطلقة الأعظم", "👑 وسام الهيبة الملكية", "👑 وسام الهيبة النادرة"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
👑 وسام الهيبة المطلقة لـ ${target}:
${randomMedal}

✨ « وسام الهيبة المطلقة… يمنح لقب ملكي خالد للأعضاء المميزين. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام الهيبة المطلقة:', err);
    }
  }
};