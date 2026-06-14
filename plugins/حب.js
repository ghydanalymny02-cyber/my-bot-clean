// *حقوق مطور مـــجـــهـــول 🛡*
// 📄 *حب.js*

module.exports = {
  command: ['حب'],
  description: '❤️ يعطي نسبة حب لشخص محدد',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";
      const love = Math.floor(Math.random() * 101);

      const infoText = `
╭──〔 ❄ مـــجـــهـــول 𝑩𝒐𝒕꧂ 〕──╮
┃ ❤️ نسبة حب ${target}
┃ 📊 ${love}%
╰━━━━━━━━━━━━━━╯

✨ « حب… أمر يكشف مدى المشاعر بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر حب:', err);
    }
  }
};