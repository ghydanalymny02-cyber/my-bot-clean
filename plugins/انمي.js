const animeList = [
  "🎌 *ناروتو* - رحلة النينجا الأسطورية ⚔️",
  "👻 *بليتش* - محاربو الشينغامي 🔥",
  "👑 *أتنك أون تايتن* - البشر ضد العمالقة 🗡️",
  "🐉 *ديمون سلاير* - القضاء على الشياطين 😈",
  "⚽ *هايكيو!!* - رياضة الكرة الطائرة 🏐",
  "🍜 *ون بيس* - البحث عن الكنز الأسطوري 🏴‍☠️",
  "🔫 *أتاك أون تايتن* - القتال من أجل البقاء 🛡️",
  "👨‍🔬 *دكتور ستون* - إعادة بناء الحضارة 🔬"
];

module.exports = {
  category: 'tools',
  command: 'انمي',
  description: 'اقتراحات انمي لمشاهدتها',
  async execute(sock, msg) {
    const anime = animeList[Math.floor(Math.random() * animeList.length)];
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🎬 *اقتراح انمي لك:*\n\n${anime}\n\n🌟 تقييم: ${Math.floor(Math.random() * 5) + 6}/10`
    }, { quoted: msg });
  }
};