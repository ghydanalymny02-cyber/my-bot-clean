module.exports = {
  category: 'tools',
  command: 'معلومه_غريبه',
  description: 'معلومات غريبة',
  async execute(sock, msg) {
    const weirdFacts = [
      "🦘 الكنغر لا يستطيع القفز إذا رفعنا ذيله!",
      "🐜 وزن جميع النمل في العالم يساوي وزن جميع البشر!",
      "🦈 أسماك القرش موجودة على الأرض قبل الأشجار!",
      "🐧 البطريق يقدم حصاة لشريكه كهدية زواج!",
      "🦒 يمكن للزرافة أن تنظف أذنيها بلسانها!"
    ];
    const randomFact = weirdFacts[Math.floor(Math.random() * weirdFacts.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🤯 *معلومة غريبة:*\n\n${randomFact}\n\n🔍 من عجائب الطبيعة!`
    }, { quoted: msg });
  }
};