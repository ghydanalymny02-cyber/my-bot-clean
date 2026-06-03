// *حقوق مطورة يوميلا 🛡*
// 📄 *حقيقة.js*

module.exports = {
  command: ['حقيقة'],
  description: '📖 يعطي حقيقة عشوائية ممتعة',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const facts = [
        "📖 هل تعلم أن الثلج يمكن أن يكون بألوان مختلفة غير الأبيض؟",
        "📖 القلوب البشرية تنبض أكثر من 100 ألف مرة يوميًا.",
        "📖 القطط تنام حوالي 70% من حياتها.",
        "📖 العسل لا يفسد أبدًا مهما طال الزمن.",
        "📖 الضحك يقوي جهاز المناعة."
      ];
      const randomFact = facts[Math.floor(Math.random() * facts.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomFact }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر حقيقة:', err);
    }
  }
};