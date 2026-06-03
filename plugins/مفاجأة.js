// *حقوق مطورة يوميلا 🛡*
// 📄 *مفاجأة.js*

module.exports = {
  command: ['مفاجأة'],
  description: '🎁 يرسل مفاجأة عشوائية للأعضاء',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const surprises = [
        "🎁 المفاجأة: أنت ملك القروب اليوم!",
        "🎁 المفاجأة: يوميلا منحتك وسام الفخامة!",
        "🎁 المفاجأة: كل من يضحك الآن سيصبح مزروفًا!"
      ];
      const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomSurprise }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر مفاجأة:', err);
    }
  }
};