const fs = require('fs');
const path = require('path');

const dirname = __dirname;
const pointsFile = path.join(dirname, '../data/points.json');

let points = {};
if (fs.existsSync(pointsFile)) {
  points = JSON.parse(fs.readFileSync(pointsFile));
}

function savePoints() {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

const countries = [
  { name: "مصر", flag: "🇪🇬" },
  { name: "السعودية", flag: "🇸🇦" },
  { name: "فلسطين", flag: "🇵🇸" },
  { name: "الجزائر", flag: "🇩🇿" },
  { name: "المغرب", flag: "🇲🇦" },
  { name: "تونس", flag: "🇹🇳" },
  { name: "لبنان", flag: "🇱🇧" },
  { name: "الأردن", flag: "🇯🇴" },
  { name: "الإمارات", flag: "🇦🇪" },
  { name: "البحرين", flag: "🇧🇭" },
  { name: "الكويت", flag: "🇰🇼" },
  { name: "قطر", flag: "🇶🇦" },
  { name: "عُمان", flag: "🇴🇲" },
  { name: "العراق", flag: "🇮🇶" },
  { name: "سوريا", flag: "🇸🇾" },
  { name: "اليمن", flag: "🇾🇪" }
];

const activeGames = {}; // حفظ الألعاب النشطة حسب الشات

module.exports = {
  command: 'علم',
  category: "🎮 الألعاب",
  description: "🌍 خمن الدولة من العلم واحصل على نقطة",
  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    if (activeGames[chatId]) {
      return sock.sendMessage(chatId, {
        text: '⚠️ هناك لعبة قائمة بالفعل! انتظر حتى تنتهي.'
      }, { quoted: m });
    }

    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const correctAnswer = randomCountry.name.trim().toLowerCase();

    // ارسال السؤال
    await sock.sendMessage(chatId, {
      text: `
•⪼ ⸽ فــعــالـية˼✒️˹ خمن الدولة
*❐─━──━〘•🕸️•〙━──━─❐*
*˼🕸️˹⥃الــعـلــم﹝ ${randomCountry.flag}﹞*
*˼🕸️˹⥃الوقت﹝30 ثانية﹞*
*❐─━──━〘•🕸️•〙━──━─❐*
*〘 تـوقــيـٕع إداࢪة الـمـمـلـڪـۃ╎⸙ 〙*
*مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 ❄️*
`
    }, { quoted: m });

    activeGames[chatId] = { finished: false };

    const handler = async ({ messages }) => {
      for (const msg of messages) {
        if (msg.key.remoteJid !== chatId) continue;

        const text = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').trim().toLowerCase();
        if (text === correctAnswer) {
          activeGames[chatId].finished = true;
          sock.ev.off('messages.upsert', handler);

          if (!points[sender]) points[sender] = 0;
          points[sender] += 1;
          savePoints();

          await sock.sendMessage(chatId, {
            text: `
*❐─━──━〘•🕸️•〙━──━─❐*
*˼🕸️˹⥃الــدولة﹝ ${randomCountry.name}﹞*
*˼🕸️˹⥃الــفــائــز﹝@${sender.split('@')[0]}﹞*
*˼🕸️˹⥃النقاط﹝${points[sender]}﹞*
*❐─━──━〘•🕸️•〙━──━─❐*
*〘 تـوقــيـٕع إداࢪة الـمـمـلـڪـۃ╎⸙ 〙*
*مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 ❄️*
`,
            mentions: [sender]
          }, { quoted: msg });

          delete activeGames[chatId];
          break;
        }
      }
    };

    sock.ev.on('messages.upsert', handler);

    // انتهاء الوقت
    setTimeout(() => {
      if (activeGames[chatId] && !activeGames[chatId].finished) {
        sock.ev.off('messages.upsert', handler);
        sock.sendMessage(chatId, {
          text: `
*❐─━──━〘•🕸️•〙━──━─❐*
⌛ انتهى الوقت!
❌ الإجابة الصحيحة: ${randomCountry.name}
*❐─━──━〘•🕸️•〙━──━─❐*
`
        });
        delete activeGames[chatId];
      }
    }, 30000);
  }
};