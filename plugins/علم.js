const fs = require('fs');
const path = require('path');
const pointsFile = path.join(__dirname, '../data/points.json');

const countries = [
  { emoji: "🇪🇬", name: "مصر", aliases: [] },
  { emoji: "🇸🇦", name: "السعودية", aliases: ["المملكة العربية السعودية"] },
  { emoji: "🇺🇸", name: "الولايات المتحدة", aliases: ["امريكا", "الولايات المتحدة الأمريكية"] },
  { emoji: "🇫🇷", name: "فرنسا", aliases: [] },
  { emoji: "🇬🇧", name: "بريطانيا", aliases: ["المملكة المتحدة", "انجلترا"] },
  { emoji: "🇯🇵", name: "اليابان", aliases: [] },
  { emoji: "🇨🇦", name: "كندا", aliases: [] },
  { emoji: "🇲🇦", name: "المغرب", aliases: [] },
  { emoji: "🇩🇿", name: "الجزائر", aliases: [] },
  { emoji: "🇹🇳", name: "تونس", aliases: [] },
  { emoji: "🇸🇾", name: "سوريا", aliases: [] },
  { emoji: "🇮🇶", name: "العراق", aliases: [] },
  { emoji: "🇵🇸", name: "فلسطين", aliases: [] },
  { emoji: "🇱🇧", name: "لبنان", aliases: [] },
  { emoji: "🇦🇪", name: "الإمارات", aliases: ["الامارات", "الامارات العربية المتحدة"] },
  { emoji: "🇶🇦", name: "قطر", aliases: [] },
  { emoji: "🇰🇼", name: "الكويت", aliases: [] },
  { emoji: "🇧🇭", name: "البحرين", aliases: [] },
  { emoji: "🇴🇲", name: "عُمان", aliases: ["عمان"] },
  { emoji: "🇧🇷", name: "البرازيل", aliases: [] },
  { emoji: "🇹🇷", name: "تركيا", aliases: [] },
  { emoji: "🇳🇵", name: "نيبال", aliases: [] },
  { emoji: "🇲🇳", name: "منغوليا", aliases: [] },
  { emoji: "🇰🇿", name: "كازاخستان", aliases: [] },
  { emoji: "🇦🇲", name: "أرمينيا", aliases: [] },
  { emoji: "🇹🇯", name: "طاجيكستان", aliases: [] },
  { emoji: "🇰🇬", name: "قيرغيزستان", aliases: [] },
  { emoji: "🇹🇲", name: "تركمانستان", aliases: [] },
  { emoji: "🇬🇪", name: "جورجيا", aliases: [] },
  { emoji: "🇺🇿", name: "أوزبكستان", aliases: [] }
];

let currentGame = {};

function loadPoints() {
  if (!fs.existsSync(pointsFile)) fs.writeFileSync(pointsFile, '{}');
  return JSON.parse(fs.readFileSync(pointsFile));
}

function savePoints(data) {
  fs.writeFileSync(pointsFile, JSON.stringify(data, null, 2));
}

function addPoints(user, amount) {
  const points = loadPoints();
  points[user] = (points[user] || 0) + amount;
  savePoints(points);
}

module.exports = {
  command: '2علم',
  description: '🌍 لعبة خمن الدولة من العلم',
  usage: '.علم',
  category: 'ترفيه',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const senderName = msg.pushName || 'مستخدم';

    if (currentGame[chatId] && currentGame[chatId].active) {
      return sock.sendMessage(chatId, {
        text: `
🚫 *لا يمكنك بدء لعبة جديدة الآن!*
📌 يوجد جولة حالياً بدأها: *${currentGame[chatId].startedBy}*
⌛ انتظر حتى تنتهي الجولة أو يتم الإجابة.

╰─⟡ 𝑩𝛩𝑻 - مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹
`
      }, { quoted: msg });
    }

    const random = countries[Math.floor(Math.random() * countries.length)];

    currentGame[chatId] = {
      answer: random.name.toLowerCase(),
      aliases: random.aliases.map(alias => alias.toLowerCase()),
      startedBy: senderName,
      active: true,
      timeout: setTimeout(() => {
        sock.sendMessage(chatId, {
          text: `⌛ انتهى الوقت! الإجابة كانت: *${random.name}*`
        });
        delete currentGame[chatId];
      }, 30000)
    };

    await sock.sendMessage(chatId, {
      text: `
╭─❒ 『 *🏴 لعبة أعلام الدول* 』 ❒─╮

*𓆩⟬ إعلان الجولة ⟭𓆪*

❁ *اسم التحدي:* ⟶ خمن الدولة  
❁ *العَلَم المعروض:* ⟶ ${random.emoji}  
❁ *المدة المتاحة:* ⟶ 30 ثانية  
❁ *الجائزة:* ⟶ 💰 10 نقاط  
❁ *المُقدم:* ⟶ ${senderName}

*⟬✨ كن أول من يجيب بشكل صحيح! ✨⟭*

╰─⟡ مع تحيات : 𝑩𝛩𝑻 - مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ⦿
`
    }, { quoted: msg });
  }
};

const fs = require('fs');
const path = require('path');
const pointsFile = path.join(__dirname, '../data/points.json');
global.handleGuess = async (sock, msg) => {
  const chatId = msg.key.remoteJid;

  const text =
    msg.message?.conversation?.toLowerCase() ||
    msg.message?.extendedTextMessage?.text?.toLowerCase() ||
    msg.message?.imageMessage?.caption?.toLowerCase() ||
    msg.message?.videoMessage?.caption?.toLowerCase() ||
    '';

  const game = currentGame[chatId];
  if (!game || !text) return;

  const senderJid = msg.key.participant || msg.key.remoteJid;
  const user = senderJid.split('@')[0];

  const allAnswers = [game.answer, ...game.aliases];

  if (allAnswers.some(ans => text.includes(ans))) {
    clearTimeout(game.timeout);
    delete currentGame[chatId];
    addPoints(user, 10);
    const total = loadPoints()[user] || 0;

    await sock.sendMessage(chatId, {
      text: `
🎉 *إجابة صحيحة!*

🏴 الإجابة كانت: *${game.answer}*

💰 *+10 نقاط* تم إضافتهم إلى رصيدك.

👤 *رصيدك الآن:* ${total} نقطة

🎯 تابع اللعب وحاول تتصدر الترتيب!

╰─⟡ 𝑩𝛩𝑻 - مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹
`
    }, { quoted: msg });
  }
};
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
  // --- الدول العربية ---
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
  { name: "اليمن", flag: "🇾🇪" },
  { name: "السودان", flag: "🇸🇩" },
  { name: "ليبيا", flag: "🇱🇾" },
  { name: "موريتانيا", flag: "🇲🇷" },
  { name: "الصومال", flag: "🇸🇴" },
  { name: "جيبوتي", flag: "🇩🇯" },
  { name: "جزر القمر", flag: "🇰🇲" },

  // --- دول آسيا وأوروبا وأمريكا وباقي العالم ---
  { name: "تركيا", flag: "🇹🇷" },
  { name: "إيران", flag: "🇮🇷" },
  { name: "اليابان", flag: "🇯🇵" },
  { name: "الصين", flag: "🇨🇳" },
  { name: "كوريا الجنوبية", flag: "🇰🇷" },
  { name: "روسيا", flag: "🇷🇺" },
  { name: "فرنسا", flag: "🇫🇷" },
  { name: "ألمانيا", flag: "🇩🇪" },
  { name: "إيطاليا", flag: "🇮🇹" },
  { name: "إسبانيا", flag: "🇪🇸" },
  { name: "بريطانيا", flag: "🇬🇧" },
  { name: "البرتغال", flag: "🇵🇹" },
  { name: "الارجنتين", flag: "🇦🇷" },
  { name: "البرازيل", flag: "🇧🇷" },
  { name: "أمريكا", flag: "🇺🇸" },
  { name: "كندا", flag: "🇨🇦" },
  { name: "المكسيك", flag: "🇲🇽" },
  { name: "هولندا", flag: "🇳🇱" },
  { name: "بلجيكا", flag: "🇧🇪" },
  { name: "سويسرا", flag: "🇨🇭" },
  { name: "الهند", flag: "🇮🇳" },
  { name: "باكستان", flag: "🇵🇰" },
  { name: "أندونيسيا", flag: "🇮🇩" },
  { name: "ماليزيا", flag: "🇲🇾" },
  { name: "أستراليا", flag: "🇦🇺" },
  { name: "السنغال", flag: "🇸🇳" },
  { name: "المغرب", flag: "🇲🇦" },
  { name: "نيجيريا", flag: "🇳🇬" },
  { name: "الكاميرون", flag: "🇨🇲" },
  { name: "غانا", flag: "🇬🇭" },
  { name: "كرواتيا", flag: "🇭🇷" },
  { name: "الأوروغواي", flag: "🇺🇾" },
  { name: "كولومبيا", flag: "🇨🇴" }
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


