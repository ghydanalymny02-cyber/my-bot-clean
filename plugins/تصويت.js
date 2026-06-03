// *حقوق مطورة يوميلا 🛡*
// 📄 *تصويت.js*

module.exports = {
  command: ['تصويت'],
  description: '📊 يفتح تصويت سريع (شاي أو قهوة)',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const infoText = `
*📊 تصويت سريع: شاي أو قهوة؟*
- ☕ قهوة
- 🍵 شاي

✨ « تصويت… أمر يضيف تفاعل ممتع داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تصويت:', err);
    }
  }
};