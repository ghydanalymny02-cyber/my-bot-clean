const movies = [
  "🎬 *الرسالة* - فيلم تاريخي عن الإسلام 🕌",
  "🎥 *الممر* - دراما حربية مصرية ✈️",
  "📽️ *الجزيرة* - تشويق وإثارة 🏝️",
  "🎞️ *الغابة* - رعب نفسي 🌲",
  "🎭 *الطريق إلي إيلات* - حرب وجاسوسية 🔍",
  "📺 *الاختيار* - سيرة ذاتية 🎖️",
  "🎪 *الكيف* - دراما اجتماعية 🍃",
  "🎟️ *فوتوكوبي* - جريمة وإثارة 🔫"
];

module.exports = {
  category: 'tools',
  command: 'فيلم',
  description: 'اقتراح فيلم لمشاهدته',
  async execute(sock, msg) {
    const movie = movies[Math.floor(Math.random() * movies.length)];
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🎞️ *اقتراح فيلم لك:*\n\n${movie}\n\n⭐ تقييم: ${(Math.random() * 3 + 7).toFixed(1)}/10`
    }, { quoted: msg });
  }
};