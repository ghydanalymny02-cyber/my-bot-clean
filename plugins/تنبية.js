// *حقوق مطورة يوميلا 🛡*
// 📄 *تنبية.js*

module.exports = {
  command: ['تنبيه'],
  description: '🚨 يرسل تنبيه عشوائي داخل القروب',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const alerts = [
        "🚨 تنبيه: المزروف الأعظم دخل القروب!",
        "🚨 تنبيه: الهيبة في أعلى مستوياتها الآن!",
        "🚨 تنبيه: الفخامة تسيطر على الأجواء!"
      ];
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomAlert }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تنبيه:', err);
    }
  }
};