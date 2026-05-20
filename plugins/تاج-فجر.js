// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_فجر.js*

module.exports = {
  command: ['تاج فجر'],
  description: '🌅 يمنح تاج الفجر لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["🌅 تاج الفجر الأعظم", "🌅 تاج المزروفية الصباحية", "🌅 تاج الهيبة النادرة"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
🌅 تاج فجر لـ ${target}:
${randomCrown}

✨ « تاج فجر… أمر يمنح لقب ملكي صباحي للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج فجر:', err);
    }
  }
};