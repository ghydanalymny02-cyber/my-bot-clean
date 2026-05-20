// *حقوق مطورة يوميلا 🛡*
// 📄 *حالة.js*

module.exports = {
  command: ['حالة'],
  description: '🌈 يعطي حالة يومية لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const states = ["😊 سعيد", "😎 واثق", "🥶 بارد", "🔥 متحمس", "💤 نعسان", "😂 ضاحك"];
      const randomState = states[Math.floor(Math.random() * states.length)];

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 🌈 حالة ${target} اليوم:
┃ ✨ ${randomState}
╰━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر حالة:', err);
    }
  }
};