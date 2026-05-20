const fs = require('fs');
const path = require('path');
const dirname = __dirname;
const pointsFile = path.join(dirname, '../data/ranks.json');
let points = {};

if (fs.existsSync(pointsFile)) {
  points = JSON.parse(fs.readFileSync(pointsFile));
}

function savePoints() {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

const words = [
  "غوجو", "ساسكي", "لوفي", "زورو", "غوكو", "فيجيتا", "غون", "كيلوا", "هيسوكا", "إيتاتشي", "مادارا", "كاكاشي", "أوبيتو", "ليفاي" 
];

module.exports = {
  command: "فكك",
  category: "🎮 الألعاب",
  description: "🔡 فكك الكلمة بنفس الترتيب واحصل على نقطة",

  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ *هذا الأمر يعمل فقط داخل المجموعات.*'
      }, { quoted: m });
    }

    const randomWord = words[Math.floor(Math.random() * words.length)];
    const separated = randomWord.split('').join(' ');

    await sock.sendMessage(chatId, {
      text: `
  •⪼ ⸽ فــعــالـية˼✒️˹ تـفـكـيـك
*❐─━──━〘•🕸️•〙━──━─❐*
*˼🕸️˹⥃الــمــقــدم﹝غوجو﹞*
*˼🕸️˹⥃فكك الكلمة التالية* 👇🏻
*˼🕸️˹⥃الكلـمـة﹝ ${randomWord}﹞*
*˼🕸️˹⥃الــوقــت﹝30S﹞*
*❐─━──━〘•🕸️•〙━──━─❐*
*〘 تـوقــيـٕع إداࢪة الـمـمـلـڪـۃ╎⸙ 〙*
*『𝐒.𝐋.𝐕⊰❄⊱سيلفر』*
*𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻 ❄*
`
    }, { quoted: m });

    const correctAnswer = separated;

    const handler = async ({ messages }) => {
      const msg = messages[0];
      const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      const from = msg.key.remoteJid;
      if (from !== chatId) return;

      if (body?.trim() === correctAnswer.trim()) {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!points[sender]) points[sender] = 0;
        points[sender] += 1;
        savePoints();

        clearTimeout(timer);
        sock.ev.off('messages.upsert', handler);

        await sock.sendMessage(chatId, {
          text: `
*❐─━──━〘•🕸️•〙━──━─❐*
*˼🕸️˹⥃الأحـرف﹝ ${correctAnswer}﹞*
*˼🕸️˹⥃الــفــائــز﹝@${sender.split('@')[0]}﹞*
*˼🕸️˹⥃الــنـقـاط﹝${points[sender]}﹞*
*❐─━──━〘•🕸️•〙━──━─❐*
*〘 تـوقــيـٕع إداࢪة الـمـمـلـڪـۃ╎⸙ 〙*
*『𝐒.𝐋.𝐕⊰❄⊱سيلفر』*
*𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻 ❄*
`,
          mentions: [sender]
        }, { quoted: msg });
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timer = setTimeout(() => {
      sock.ev.off('messages.upsert', handler);
      sock.sendMessage(chatId, {
        text: `
*❐─━──━〘•🕸️•〙━──━─❐*
⌛ *انتهى الوقت!*
❌ *الإجابة كانت:* ${correctAnswer}
*❐─━──━〘•🕸️•〙━──━─❐*
`
      }, { quoted: m });
    }, 30000);
  }
};