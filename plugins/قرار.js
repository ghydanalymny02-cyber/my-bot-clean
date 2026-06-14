module.exports = {
  command: "قرار",
  description: "⚖️ يخلي البوت يقرر عنك",
  category: "ترفيه",
  usage: ".قرار",

  async execute(sock, msg) {
    const decisions = [
      "✅ نعم، نفذ الآن.",
      "❌ لا تعمل كده أبدًا.",
      "🤔 فكّر شوية كمان.",
      "🔥 نفذها بدون تردد!",
      "🚫 انسَ الموضوع نهائيًا.",
      "☠️ النتيجة مش مضمونة... بس جرب!"
    ];

    const result = decisions[Math.floor(Math.random() * decisions.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `⚖️ *قرار مـــجـــهـــول BOT النهائي:*\n\n${result}`
    }, { quoted: msg });
  }
};