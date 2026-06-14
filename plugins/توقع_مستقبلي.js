// *حقوق مطورة يوميلا 🛡*
// 📄 *توقع_مستقبلي.js*

module.exports = {
  command: ['توقع مستقبلي'],
  description: '🔮 يعطي توقع مستقبلي عشوائي',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const predictions = [
        "🔮 ستصبح ملك الهيبة قريبًا.",
        "🔮 ستنال لقب المزروف الأعظم.",
        "🔮 يومك مليء بالمفاجآت الغامضة.",
        "🔮 ستجد صديقًا وفيًا يقف بجانبك.",
        "🔮 الفخامة سترافقك دائمًا."
      ];
      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomPrediction }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر توقع مستقبلي:', err);
    }
  }
};