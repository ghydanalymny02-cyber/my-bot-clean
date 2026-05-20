// *حقوق مطورة يوميلا 🛡*
// 📄 *تقييم_فني.js*

module.exports = {
  command: ['تقييم فني'],
  description: '🎨 يعطي تقييم فني لشخص (إبداع + جمال + هيبة)',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const creativity = Math.floor(Math.random() * 101);
      const beauty = Math.floor(Math.random() * 101);
      const prestige = Math.floor(Math.random() * 101);

      const infoText = `
🎨 تقييم فني لـ ${target}:
✨ إبداع: ${creativity}%
✨ جمال: ${beauty}%
✨ هيبة: ${prestige}%

« تقييم فني… أمر يضيف لمسة جمالية وفخمة داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تقييم فني:', err);
    }
  }
};