// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام_هيبة_غامضة.js*

module.exports = {
  command: ['وسام هيبة غامضة'],
  description: '🌌 يمنح وسام هيبة غامضة لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["🌌 وسام الهيبة الغامضة الأعظم", "🌌 وسام الأسرار الملكية", "🌌 وسام المزروفية الليلية"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
🌌 وسام هيبة غامضة لـ ${target}:
${randomMedal}

✨ « وسام هيبة غامضة… يمنح لقب ملكي غامض للأعضاء المميزين. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام هيبة غامضة:', err);
    }
  }
};