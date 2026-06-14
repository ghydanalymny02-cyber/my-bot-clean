// *حقوق مطورة يوميلا 🛡*
// 📄 *تصفيق.js*

module.exports = {
  command: ['تصفيق'],
  description: '👏 يجعل البوت يصفق لشخص محدد',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const infoText = `
👏👏👏 تصفيق حار لـ ${target} 👏👏👏
✨ « تصفيق… أمر يضيف جو من الدعم والفخامة داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تصفيق:', err);
    }
  }
};