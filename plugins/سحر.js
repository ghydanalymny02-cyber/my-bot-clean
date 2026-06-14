// *حقوق مطورة يوميلا 🛡*
// 📄 *سحر.js*

module.exports = {
  command: ['سحر'],
  description: '✨ يعطي نسبة سحر لشخص محدد',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";
      const charm = Math.floor(Math.random() * 101);

      const infoText = `
╭──〔 ❄ مـــجـــهـــول 𝑩𝒐𝒕꧂ 〕──╮
┃ ✨ نسبة سحر ${target}
┃ 📊 ${charm}%
╰━━━━━━━━━━━━━━╯

✨ « سحر… أمر يكشف مدى جاذبيتك بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر سحر:', err);
    }
  }
};