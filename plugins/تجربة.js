// تجربة.js
module.exports = {
  command: ['تجربة'],
  description: 'نجرب بوت',
  category: 'تجارب',
  
  async execute(sock, msg, args) {
    try {
      // الكود هنا
      await sock.sendMessage(msg.key.remoteJid, {
        text: '📌 **ر**'
      });
    } catch (err) {
      console.error("❌ خطأ:", err);
    }
  }
};