// *حقوق مطورة يوميلا 🛡*
// 📄 *جنون.js*

module.exports = {
  command: ['جنون'],
  description: '🤪 يرسل تصرف عشوائي مجنون داخل القروب',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const madness = [
        "🤪 يوميلا قررت أن كل الرسائل اليوم ستكون بالهيبة فقط!",
        "🤪 المزروفين سيطروا على القروب الآن!",
        "🤪 كل عضو يجب أن يرسل إيموجي غريب فورًا!"
      ];
      const randomMadness = madness[Math.floor(Math.random() * madness.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomMadness }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر جنون:', err);
    }
  }
};