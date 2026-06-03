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
  "ناروتو", "كايغاكو", "كيوبي", "ناكيمي", "ميكاسا", "إيرين", "جيوكو", "هانتينغو", "تشوبر", "غوكو", "فيجيتا", "غون", "كيلوا", "ميكا",
  "تانجيرو", "نيزوكو", "سايتاما", "اكييرا", "دراجون", "نيجي", "هيناتا", "شينوبو", "لاك", "يوتا", "إيتاتشي", "مادارا", "بوروتو",
  "كاكاشي", "أوبيتو", "داكي", "تنغن", "بيك", "ليفاي", "هانجي", "كوني", "أرمن", "راي", "ساكوراغي", "ريتسو", "تاي", "سابو", "نامي",
  "روبن", "بروك", "فرانكي", "سانجي", "وانغ", "سونغ", "كايدو", "سون", "تيتش", "شينرا", "ارثر", "إيسكا", "تاكا",
  "ريكا", "كورو", "كاغويا", "إندو", "تايسون", "غيوتارو", "ميتسكي", "كونان", "كيرا", "إل", "لايت", "ريوك", "ساشا", "ريناكو", "إيتشيغو",
  "أوراهارا", "رايلي", "كين", "توكا", "راينر", "جيرايا", "كوركو", "ايزن", "نيجي", "مايكي", "ساسكي", "ساكورا", "جان",
  "هيروشي", "يوسوب", "ماكا", "سول", "غارا", "ميدوريا", "هوري", "غارب", "كيو", "ايس", "زورو", "ميغومي", "لوفي", "كانيكي"
];

module.exports = {
  command: "رتبهم",
  category: "🎮 الألعاب",
  description: "🎲 لعبة ترتيب الحروف لشخصيات أنمي",

  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ *هذا الأمر يعمل فقط داخل المجموعات.*'
      }, { quoted: m });
    }

    const randomWord = words[Math.floor(Math.random() * words.length)];
    const shuffled = randomWord.split('').sort(() => Math.random() - 0.5).join(' ');

    await sock.sendMessage(chatId, {
      text: `
 •⪼ ⸽ فــعــالـية˼✒️˹ تـرتــيــب
*❐─━──━〘•🕸️•〙━──━─❐*
*˼🕸️˹⥃الأحـرف﹝ ${shuffled}﹞*
*˼🕸️˹⥃الــوقــت﹝30S﹞*
*˼🕸️˹⥃الــمــقــدم﹝غوجو﹞*
*❐─━──━〘•🕸️•〙━──━─❐*
*〘 تـوقــيـٕع إداࢪة الـمـمـلـڪـۃ╎⸙ 〙*
*『𝐒.𝐑.𝐘⊰🇸🇾⊱سيروشيا』*
*𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻 🌋*
`


    }, { quoted: m });

    const correctAnswer = randomWord;

    const handler = async ({ messages }) => {
      const msg = messages[0];
      const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      const from = msg.key.remoteJid;
      if (from !== chatId) return;

      if (body?.toLowerCase() === correctAnswer.toLowerCase()) {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!points[sender]) points[sender] = 0;
        points[sender] += 1;
        savePoints();

        clearTimeout(timer);
        sock.ev.off('messages.upsert', handler);

        await sock.sendMessage(chatId, {
          text: `
*❐─━──━〘•🕸️•〙━──━─❐*
 *˼🕸️˹⥃الـكــلــمــة﹝${correctAnswer}﹞*
*˼🕸️˹⥃الــفــائــز﹝@${sender.split('@')[0]}﹞*
*˼🕸️˹⥃الــنـقـاط﹝${points[sender]}﹞*
*❐─━──━〘•🕸️•〙━──━─❐*
*〘 تـوقــيـٕع إداࢪة الـمـمـلـڪـۃ╎⸙ 〙*
*『𝐒.𝐋.𝐕⊰❄⊱سيلفر』*
*𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻 ❄*`,
          mentions: [sender]
        }, { quoted: msg });
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timer = setTimeout(() => {
      sock.ev.off('messages.upsert', handler);
      sock.sendMessage(chatId, {
        text: `
      ⌛ *انتهى الوقت!*
      ❌ *الكلمة كانت:* ${correctAnswer}
`
      }, { quoted: m });
    }, 30000);
  }
};