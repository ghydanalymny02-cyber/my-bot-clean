// *حقوق مطورة يوميلا 🛡*
// 📄 *مديح.js*

module.exports = {
  command: ['مديح'],
  description: '🌟 يعطي مديح عشوائي لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const compliments = [
        "🌟 حضورك يضيء القروب.",
        "🌟 أنت مثال للفخامة والهيبة.",
        "🌟 شخصيتك نادرة ومميزة.",
        "🌟 المزروف الحقيقي بيننا."
      ];
      const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];

      const infoText = `
🌟 مديح لـ ${target}:
${randomCompliment}

✨ « مديح… أمر يضيف لمسة تقدير وفخامة داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر مديح:', err);
    }
  }
};