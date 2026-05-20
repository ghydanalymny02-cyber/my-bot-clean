// *حقوق مطورة يوميلا 🛡*
// 📄 *وسام.js*

module.exports = {
  command: ['وسام'],
  description: '🏅 يمنح عضو وسام فخامة',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const medals = ["🏅 وسام الهيبة", "🥇 وسام الفخامة", "🥶 وسام البرودة", "💎 وسام الندرة"];
      const randomMedal = medals[Math.floor(Math.random() * medals.length)];

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ ${randomMedal} مُنح لـ ${target}
╰━━━━━━━━━━━━━━╯

✨ « وسام… أمر يمنح لمسة شرفية فخمة للأعضاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر وسام:', err);
    }
  }
};