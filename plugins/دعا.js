// *حقوق مطورة يوميلا 🛡*
// 📄 *دعاء.js*

module.exports = {
  command: ['دعاء'],
  description: '🤲 يرسل دعاء قصير لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const prayers = [
        "🤲 رزقك الله السعادة والهيبة.",
        "🤲 حفظك الله من كل سوء.",
        "🤲 منحك الله القوة والفخامة.",
        "🤲 جعلك الله مزروفًا في الخير فقط.",
        "🤲 بارك الله في أيامك."
      ];
      const randomPrayer = prayers[Math.floor(Math.random() * prayers.length)];

      const infoText = `
🤲 دعاء لـ ${target}:
${randomPrayer}

✨ « دعاء… أمر يضيف لمسة روحانية ودعم داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر دعاء:', err);
    }
  }
};