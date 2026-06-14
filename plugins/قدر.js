// *حقوق مطورة يوميلا 🛡*
// 📄 *قدر.js*

module.exports = {
  command: ['قدر'],
  description: '🔮 يرسل جملة غامضة عن مستقبل شخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const fortunes = [
        "سيأتيك يوم مليء بالهيبة والسطوع.",
        "قوة خفية ستظهر في طريقك قريبًا.",
        "ستُزرف في موقف يجعلك أسطورة.",
        "الحظ يبتسم لك اليوم، استغله.",
        "ستجد صديقًا وفيًا يقف بجانبك."
      ];

      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

      const infoText = `
╭──〔 ❄ مـــجـــهـــول 𝑩𝒐𝒕꧂ 〕──╮
┃ 🔮 قدر ${target}
┃ ✨ ${randomFortune}
╰━━━━━━━━━━━━━━╯

✨ « قدر… أمر يفتح لك نافذة غامضة على المستقبل. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر قدر:', err);
    }
  }
};