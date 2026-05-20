// *حقوق مطورة يوميلا 🛡*
// 📄 *مقلب.js*

module.exports = {
  command: ['مقلب'],
  description: '😂 يرسل مقلب نصي مضحك لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const pranks = [
        "😂 تم اختيارك لتكون المزروف الأبدي!",
        "🤣 يوميلا أعلنت أنك ملك المقالب اليوم!",
        "😅 كل رسائلك ستتحول إلى إيموجي ضحك لمدة ساعة!"
      ];
      const randomPrank = pranks[Math.floor(Math.random() * pranks.length)];

      const infoText = `
😂 مقلب لـ ${target}:
${randomPrank}

✨ « مقلب… أمر يضيف جو من الكوميديا داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر مقلب:', err);
    }
  }
};