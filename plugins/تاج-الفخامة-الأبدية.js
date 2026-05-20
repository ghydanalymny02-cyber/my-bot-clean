// *حقوق مطورة يوميلا 🛡*
// 📄 *تاج_الفخامة_الأبدية.js*

module.exports = {
  command: ['تاج الفخامة الأبدية'],
  description: '💎 يمنح تاج الفخامة الأبدية لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const crowns = ["💎 تاج الفخامة الأبدية", "💎 تاج الهيبة المطلقة", "💎 تاج المزروفية الملكية"];
      const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];

      const infoText = `
💎 تاج الفخامة الأبدية لـ ${target}:
${randomCrown}

✨ « تاج الفخامة الأبدية… يمنح لقب ملكي خالد للأعضاء المميزين. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تاج الفخامة الأبدية:', err);
    }
  }
};