// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_أحلام.js*

module.exports = {
  command: ['تاج أحلام'],
  description: '👑 يمنح تاج الأحلام لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["👑 تاج الأحلام الأعظم", "👑 تاج المزروفية الحالمة", "👑 تاج الهيبة الليلية"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
👑 تاج أحلام لـ ${target}:
${randomCrown}

✨ « تاج أحلام… أمر يمنح لقب ملكي حالِم للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج أحلام:', err);
    }
  }
};