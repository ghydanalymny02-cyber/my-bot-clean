// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡*
// 📄 *بركة.js*

module.exports = {
  command: ['بركة'],
  description: '🌹 يعطي بركة أو دعاء قصير لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const blessings = [
        "🌹 بركة يوميلا: رزقك الله بالهيبة والفخامة.",
        "🌹 بركة المزروفين: جعل الله أيامك مليئة بالسطوع.",
        "🌹 بركة القوة: منحك الله حضورًا لا يُنسى.",
        "🌹 بركة الولاء: رزقك الله بأصدقاء أوفياء.",
        "🌹 بركة السعادة: جعل الله قلبك مليئًا بالفرح."
      ];
      const randomBlessing = blessings[Math.floor(Math.random() * blessings.length)];

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 Bot 〕──╮
┃ 🌹 بركة لـ ${target}:
┃ ✨ ${randomBlessing}
╰━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر بركة:', err);
    }
  }
};