module.exports = {
  command: ['محظوظ'],
  category: 'fun',
  description: 'يحسب الحظ عند الشخص بشكل مدروس.',
  async execute(sock, msg) {
    const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❗ منشن شخص عشان احسب الحظ عنده\nمثال: .حظ @العضو',
      }, { quoted: msg });
    }

    const data = [
      { percent: getRandom(1, 10), text: 'حظك مااش. لا تسوي شي اليوم 🐧.' },
      { percent: getRandom(11, 30), text: 'حظك سيء اذا شي خفيف سويه الان ⏰.' },
      { percent: getRandom(31, 40), text: 'مو اسوء شي. تقدر تكمل يومك طبيعي 👤.' },
      { percent: getRandom(41, 60), text: 'واو. حظك بدأ يتحسن. فوت و الهوا بظهرك 💨. ' },
      { percent: getRandom(61, 99), text: 'عين الباردة عليك. حظك ممتااااااز 👑. ' },
      { percent: 100, text: 'انت هكرت الحظ 💰' }
    ];

    const result = data[Math.floor(Math.random() * data.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📊 نسبة الحظ عند @${target.split('@')[0]}: *${result.percent}%*\n${result.text}`,
      mentions: [target]
    }, { quoted: msg });
  }
};

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}