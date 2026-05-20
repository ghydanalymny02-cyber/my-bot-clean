// *حقوق مطورة يوميلا 🛡*
// 📄 *لوحة.js*

module.exports = {
  command: ['لوحة'],
  description: '🎨 يرسل وصف لوحة فنية غامضة',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const paintings = [
        "🎨 لوحة غامضة تُظهر شخصًا يقف وسط ضباب، تحيط به هالة من الهيبة.",
        "🎨 لوحة فخمة لعرش من الجليد، يجلس عليه المزروف الأعظم.",
        "🎨 لوحة نادرة تُظهر قروبًا يحتفل تحت سماء مليئة بالنجوم."
      ];
      const randomPainting = paintings[Math.floor(Math.random() * paintings.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomPainting }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر لوحة:', err);
    }
  }
};