// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡*
// 📄 *تصنيف.js*

module.exports = {
  command: ['تصنيف'],
  description: '🏆 يعطي تصنيف عشوائي لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const ranks = ["🏆 الأول في الهيبة", "🥈 الثاني في الفخامة", "🥉 الثالث في المزروفية", "💎 النادر بين الجميع"];
      const randomRank = ranks[Math.floor(Math.random() * ranks.length)];

      const infoText = `
╭──〔 ❄ مـــجـــهـــول 𝑩𝒐𝒕꧂ 〕──╮
┃ 🏆 تصنيف ${target}
┃ ✨ ${randomRank}
╰━━━━━━━━━━━━━━╯

✨ « تصنيف… أمر يمنح لقب عشوائي للأعضاء بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تصنيف:', err);
    }
  }
};