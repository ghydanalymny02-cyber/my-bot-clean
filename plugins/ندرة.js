// *حقوق مطورة يوميلا 🛡*
// 📄 *ندرة.js*

module.exports = {
  command: ['ندرة'],
  description: '💎 يعطي نسبة ندرة لشخص محدد',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";
      const rarity = Math.floor(Math.random() * 101);

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 💎 نسبة ندرة ${target}
┃ 📊 ${rarity}%
╰━━━━━━━━━━━━━━╯

✨ « ندرة… أمر يكشف مدى تميز الأشخاص بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر ندرة:', err);
    }
  }
};