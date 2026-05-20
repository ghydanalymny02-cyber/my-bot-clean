// *حقوق مطورة يوميلا 🛡*
// 📄 *تنبؤ_غامض.js*

module.exports = {
  command: ['تنبؤ غامض'],
  description: '🌌 يعطي تنبؤ غامض لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const predictions = [
        "🌌 ستُزرف في موقف لا يُنسى.",
        "🌌 الهيبة سترافقك دائمًا.",
        "🌌 ستنال لقب ملك الفخامة قريبًا.",
        "🌌 يومك مليء بالأسرار."
      ];
      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];

      const infoText = `
🌌 تنبؤ غامض لـ ${target}:
${randomPrediction}

✨ « تنبؤ غامض… أمر يضيف لمسة سحرية وغامضة داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تنبؤ غامض:', err);
    }
  }
};