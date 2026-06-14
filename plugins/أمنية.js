// *حقوق مطورة يوميلا 🛡*
// 📄 *أمنية.js*

module.exports = {
  command: ['أمنية'],
  description: '🌠 يكتب أمنية عشوائية لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const wishes = [
        "🌠 أتمنى لك يوم مليء بالهيبة والفخامة.",
        "🌠 ستنال ما تحلم به قريبًا.",
        "🌠 السعادة في طريقك إليك.",
        "🌠 ستُزرف في موقف يجعلك أسطورة.",
        "🌠 أمنية تتحقق لك قريبًا بإذن الله."
      ];
      const randomWish = wishes[Math.floor(Math.random() * wishes.length)];

      const infoText = `
╭──〔 ❄ مـــجـــهـــول 𝑩𝒐𝒕꧂ 〕──╮
┃ 🌠 أمنية لـ ${target}
┃ ✨ ${randomWish}
╰━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر أمنية:', err);
    }
  }
};