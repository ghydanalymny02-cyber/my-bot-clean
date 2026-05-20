// *حقوق مطورة يوميلا 🛡*
// 📄 *قدر_غامض.js*

module.exports = {
  command: ['قدر غامض'],
  description: '🌌 يكشف مصير غامض لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const destinies = [
        "🌌 مصيرك أن تصبح أسطورة الهيبة.",
        "🌌 ستُزرف في موقف لا يُنسى.",
        "🌌 الغموض يحيط بك من كل جانب.",
        "🌌 ستنال لقب ملك الفخامة قريبًا.",
        "🌌 يومك مليء بالأسرار."
      ];
      const randomDestiny = destinies[Math.floor(Math.random() * destinies.length)];

      const infoText = `
🌌 قدر غامض لـ ${target}:
${randomDestiny}

✨ « قدر غامض… أمر يضيف لمسة سحرية وغامضة داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر قدر غامض:', err);
    }
  }
};