const fs = require('fs');
const path = require('path');

const dirname = __dirname;
const pointsFile = path.join(dirname, '../data/points.json');
let points = {};
if (fs.existsSync(pointsFile)) points = JSON.parse(fs.readFileSync(pointsFile));
function savePoints() {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

// قائمة الجرائم والشخصيات
const cases = [
  {
    crime: "🕵️‍♂️ تم العثور على شخصية أنمي مشهورة مقتولة في غابة مهجورة!",
    suspects: ["إيتاشي", "لايت", "هيسوكا", "ليفاي"],
    killer: "لايت"
  },
  {
    crime: "💀 وُجدت شخصية ميتة في أحد الأبراج العالية بعد سقوطها الغامض.",
    suspects: ["كاكاشي", "لوفي", "إرين", "ماكوتو"],
    killer: "ماكوتو"
  },
  {
    crime: "🔪 قُتلت شخصية في مطبخ القصر باستخدام سكين!",
    suspects: ["ميكاسا", "هيناتا", "شينوبو", "أكازا"],
    killer: "شينوبو"
  },
  {
    crime: "🩸 جريمة غريبة حدثت في مهرجان أنمي... الضحية قُتلت وسط الحشود!",
    suspects: ["سايتاما", "زورو", "باجي", "إيتشيغو"],
    killer: "باجي"
  },
  {
    crime: "🎭 تم العثور على جثة في المسرح! والجميع كان يرتدي أقنعة.",
    suspects: ["كيليوا", "لاو", "شيسوي", "توغورو"],
    killer: "شيسوي"
  }
  // يمكن إضافة المزيد لاحقًا
];

const activeGames = {};

module.exports = {
  command: "القاتل",
  category: "🎮 الألعاب",
  description: "🕵️‍♂️ خمن القاتل في الجريمة واحصل على نقطة",
  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    if (activeGames[chatId]) {
      return sock.sendMessage(chatId, {
        text: '⚠️ هناك لعبة قائمة بالفعل! انتظر حتى تنتهي.'
      }, { quoted: m });
    }

    // اختيار جريمة عشوائية
    const randomCase = cases[Math.floor(Math.random() * cases.length)];
    const correctAnswer = randomCase.killer.trim().toLowerCase();

    await sock.sendMessage(chatId, {
      text: `
•⪼ ⸽ فــعــالـية˼✒️˹ خمن القاتل
*❐─━──━〘•🕸️•〙━──━─❐*
*˼🕸️˹⥃الــجريمة﹝ ${randomCase.crime}﹞*
*˼🕸️˹⥃المشتبه بهم﹝ ${randomCase.suspects.join(", ")}﹞*
*˼🕸️˹⥃الوقت﹝30 ثانية﹞*
*❐─━──━〘•🕸️•〙━──━─❐*
*〘 تـوقــيـٕع إداࢪة الـمـمـلـڪـۃ╎⸙ 〙*
*مـــجـــهـــول 𝑩𝑶𝑻 ❄*
`
    }, { quoted: m });

    activeGames[chatId] = { finished: false };

    const handler = async ({ messages }) => {
      for (const msg of messages) {
        if (msg.key.remoteJid !== chatId) continue;

        const text = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').trim().toLowerCase();
        const senderAnswer = msg.key.participant || msg.key.remoteJid;

        if (text === correctAnswer) {
          activeGames[chatId].finished = true;
          sock.ev.off('messages.upsert', handler);

          if (!points[senderAnswer]) points[senderAnswer] = 0;
          points[senderAnswer] += 1;
          savePoints();

          await sock.sendMessage(chatId, {
            text: `
*❐─━──━〘•🕸️•〙━──━─❐*
*˼🕸️˹⥃الــقــاتــل﹝ ${randomCase.killer}﹞*
*˼🕸️˹⥃الــفــائــز﹝@${senderAnswer.split('@')[0]}﹞*
*˼🕸️˹⥃النــقــاط﹝${points[senderAnswer]}﹞*
*❐─━──━〘•🕸️•〙━──━─❐*
*〘 تـوقــيـٕع إداࢪة الـمـمـلـڪـۃ╎⸙ 〙*
*مـــجـــهـــول 𝑩𝑶𝑻 ❄*
`,
            mentions: [senderAnswer]
          }, { quoted: msg });
        }
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timer = setTimeout(() => {
      sock.ev.off('messages.upsert', handler);
      if (!activeGames[chatId].finished) {
        sock.sendMessage(chatId, {
          text: `
*❐─━──━〘•🕸️•〙━──━─❐*
⌛ انتهى الوقت!
❌ لم يتمكن أحد من معرفة القاتل
*❐─━──━〘•🕸️•〙━──━─❐*
`
        });
      }
      delete activeGames[chatId];
    }, 30000);
  }
};