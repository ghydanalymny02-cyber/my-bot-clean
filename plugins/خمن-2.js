// *حقوق مطورة يوميلا 🛡*
// 📄 *خمن-2.js*

module.exports = {
  command: ['خمن'],
  description: '🎲 لعبة تخمين ممتدة مع عدة مستويات وتلميحات',
  category: 'games',

  async execute(sock, msg) {
    try {
      const options = [
        {
          question: "🎲 المستوى الأول: خمن رقم من 1 إلى 10…",
          hint: "💡 الرقم مرتبط بالهيبة، ليس صغيرًا جدًا ولا كبيرًا جدًا.",
          answer: Math.floor(Math.random() * 10) + 1
        },
        {
          question: "🎲 المستوى الثاني: خمن الكلمة السرية…",
          hint: "💡 الكلمة هي اسم سيد الهيبة.",
          answer: "يوميلا"
        },
        {
          question: "🎲 المستوى الثالث: خمن الرمز الملكي…",
          hint: "💡 الرمز يجمع بين القوة والليل والثلج.",
          answer: "👑❄️🌘"
        }
      ];
      const randomOption = options[Math.floor(Math.random() * options.length)];

      const infoText = `
🎲 لعبة التخمين الملكية بدأت!
${randomOption.question}

${randomOption.hint}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر خمن:', err);
    }
  }
};