// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡*
// 📄 *تصفيحة.js*

module.exports = {
  command: ['تصفيحة'],
  description: '✋ High-Five مع العضو',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const infoText = `
✋ تصفيحة قوية لـ ${target}!
✨ « تصفيحة… أمر يضيف جو من المرح والتفاعل داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تصفيحة:', err);
    }
  }
};