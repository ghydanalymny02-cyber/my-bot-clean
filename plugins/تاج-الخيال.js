// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_الخيال.js*

module.exports = {
  command: ['تاج الخيال'],
  description: '🎨 يمنح تاج الخيال لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["🎨 تاج الخيال الأعظم", "🎨 تاج المزروفية الحالمة", "🎨 تاج الهيبة الإبداعية"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
🎨 تاج الخيال لـ ${target}:
${randomCrown}

« تاج الخيال… يمنح لقب فني ملكي للأعضاء المميزين. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج الخيال:', err);
    }
  }
};