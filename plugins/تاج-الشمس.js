// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_الشمس.js*

module.exports = {
  command: ['تاج الشمس'],
  description: '☀️ يمنح تاج الشمس لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["☀️ تاج الشمس الأعظم", "☀️ تاج المزروفية الذهبية", "☀️ تاج الهيبة المضيئة"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
☀️ تاج الشمس لـ ${target}:
${randomCrown}

✨ « تاج الشمس… يمنح لقب ملكي مشرق للأعضاء المميزين. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج الشمس:', err);
    }
  }
};