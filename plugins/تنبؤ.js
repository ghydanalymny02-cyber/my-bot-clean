// *حقوق مطورة يوميلا 🛡*
// 📄 *تنبؤ.js*

module.exports = {
  command: ['تنبؤ'],
  description: '🔮 يعطي تنبؤ عشوائي للمستقبل',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const predictions = [
        "🔮 ستصبح ملك القروب قريبًا.",
        "🔮 ستنال لقب الزارف الأعظم.",
        "🔮 يومك مليء بالمفاجآت.",
        "🔮 ستجد صديقًا وفيًا يقف بجانبك.",
        "🔮 الهيبة سترافقك دائمًا."
      ];
      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomPrediction }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تنبؤ:', err);
    }
  }
};