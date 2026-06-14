// *حقوق مطورة يوميلا 🛡*
// 📄 *توقع.js*

module.exports = {
  command: ['توقع'],
  description: '🔮 يعطي توقع يومي لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const predictions = [
        "🔮 اليوم ستواجه موقف يبرز هيبتك.",
        "🔮 ستنال فرصة نادرة لا تتكرر.",
        "🔮 شخص ما سيُظهر لك ولاء غير متوقع.",
        "🔮 ستُزرف في موقف يجعلك أسطورة.",
        "🔮 يوم مليء بالفخامة والسطوع."
      ];
      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];

      const infoText = `
╭──〔 ❄ مـــجـــهـــول 𝑩𝒐𝒕꧂ 〕──╮
┃ 🔮 توقع ${target} اليوم:
┃ ✨ ${randomPrediction}
╰━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر توقع:', err);
    }
  }
};