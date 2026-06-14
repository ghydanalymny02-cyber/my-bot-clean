// *حقوق مطورة يوميلا 🛡*
// 📄 *مزاج.js*

module.exports = {
  command: ['مزاج'],
  description: '🌈 يعطي حالة مزاجية عشوائية لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const moods = ["😊 سعيد", "😡 غاضب", "🥶 بارد", "😎 واثق", "😂 ضاحك", "💤 نعسان"];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 🌈 مزاج ${target} اليوم:
┃ ✨ ${randomMood}
╰━━━━━━━━━━━━━━╯

✨ « مزاج… أمر يضيف لمسة مرحة عن الحالة اليومية للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر مزاج:', err);
    }
  }
};