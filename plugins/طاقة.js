// *حقوق مطورة يوميلا 🛡*
// 📄 *طاقة.js*

module.exports = {
  command: ['طاقة'],
  description: '⚡ يعطي نسبة طاقة لشخص محدد',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";
      const energy = Math.floor(Math.random() * 101);

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ ⚡ نسبة طاقة ${target}
┃ 📊 ${energy}%
╰━━━━━━━━━━━━━━╯

✨ « طاقة… أمر يكشف مدى حماس الأشخاص بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر طاقة:', err);
    }
  }
};