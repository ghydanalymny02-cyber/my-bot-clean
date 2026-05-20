// *حقوق مطورة يوميلا 🛡*
// 📄 *هيبة.js*

module.exports = {
  command: ['هيبة'],
  description: '😎 يعطي نسبة هيبة لشخص محدد',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";
      const power = Math.floor(Math.random() * 101);

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 😎 نسبة هيبة ${target}
┃ 📊 ${power}%
╰━━━━━━━━━━━━━━╯

✨ « هيبة… أمر يكشف مدى قوة حضورك بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر هيبة:', err);
    }
  }
};