// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_فكاهة.js*

module.exports = {
  command: ['تاج فكاهة'],
  description: '👑 يمنح تاج الفكاهة لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["👑 تاج الفكاهة الأعظم", "👑 تاج المزحة الملكية", "👑 تاج الضحك النادر"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
👑 تاج فكاهة لـ ${target}:
${randomCrown}

✨ « تاج فكاهة… أمر يمنح لقب كوميدي ملكي للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج فكاهة:', err);
    }
  }
};