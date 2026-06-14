const books = [
  "📚 *الأب الغني والأب الفقير* - روبرت كيوساكي 💰",
  "📖 *العادات السبع للناس الأكثر فعالية* - ستيفن كوفي ⭐",
  "📕 *قوة التفكير الإيجابي* - نورمان فينسنت 🧠",
  "📗 *الرجل الذي حسب درجات الجحيم* - أدهم شرقاوي ✍️",
  "📘 *ألف ليلة وليلة* - تراث عربي 🌙",
  "📙 *كليلة ودمنة* - ابن المقفع 🐘",
  "📓 *البؤساء* - فيكتور هيجو 😢",
  "📔 *مئة عام من العزلة* - غابرييل غارسيا ماركيث 🏡"
];

module.exports = {
  category: 'tools',
  command: 'كتاب',
  description: 'اقتراح كتاب للقراءة',
  async execute(sock, msg) {
    const book = books[Math.floor(Math.random() * books.length)];
    await sock.sendMessage(msg.key.remoteJid, {
      text: `📖 *اقتراح كتاب:*\n\n${book}\n\n⏳ وقت القراءة المقدر: ${Math.floor(Math.random() * 20) + 5} ساعة`
    }, { quoted: msg });
  }
};