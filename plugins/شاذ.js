module.exports = {
  command: ['شاذ'],
  category: 'ترفيه',
  description: 'يحسب نسبة الشذوذ عند عضو بشكل عشوائي',
  async execute(sock, msg) {
    const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❗ منشن حد عشان أحسب له نسبة الشذوذ\nمثال: .شاذ @العضو',
      }, { quoted: msg });
    }

    const data = [
      { percent: getRandom(1, 20), text: '✅ لسه فاضللك شوية... حاول تمسك نفسك قبل ما يفوت الأوان 😅' },
      { percent: getRandom(21, 40), text: '⚠️ في بوادر... راقب تحركاتك يا قلبي 🫠' },
      { percent: getRandom(41, 60), text: '🚨 نص نص... إنت على الحافة يا نجم 🌈' },
      { percent: getRandom(61, 80), text: '🏳️‍🌈 واضح إنك بتغرق... الشذوذ الجيييييي 😭' },
      { percent: getRandom(81, 99), text: '🔥 إنت شاذ رسمي... سلملي على ولاء ✋🤣' },
      { percent: 100, text: '🛑 مبروك! تم اعتمادك رسميًا من جمعية الشواذ العالمية 🌈💅' }
    ];

    const result = data[Math.floor(Math.random() * data.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📊 نسبة الشذوذ عند @${target.split('@')[0]}: *${result.percent}%*\n${result.text}`,
      mentions: [target]
    }, { quoted: msg });
  }
};

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}