// *حقوق مطورة يوميلا 🛡*
// 📄 *حظ.js*

module.exports = {
  command: ['حظ'],
  description: '🍀 يعطي نسبة حظ لشخص محدد',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";
      const luck = Math.floor(Math.random() * 101);

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 🍀 نسبة حظ ${target}
┃ 📊 ${luck}%
╰━━━━━━━━━━━━━━╯

✨ « حظ… أمر يكشف مدى نصيبك من الحظ بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر حظ:', err);
    }
  }
};