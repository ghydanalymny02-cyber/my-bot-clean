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

const rewardMap = { سهل: 1, متوسط: 2, صعب: 3 };
const timeMap = { سهل: 20000, متوسط: 30000, صعب: 40000 };

const words = {
  سهل: ["غوجو", "ساسكي", "لوفي", "زورو", "غوكو", "فيجيتا"],
  متوسط: ["غون", "كيلوا", "هيسوكا", "إيتاتشي", "مادارا", "كاكاشي"],
  صعب: ["أوبيتو", "ليفاي", "غيتو", "ايتادوري", "ميغومي", "توجي", "كيريتو", "نانامي"]
};

const validLevels = ['سهل', 'متوسط', 'صعب'];

module.exports = {
  command: "تفكيك",
  category: "🎮 الألعاب",
  description: "🔡 تفكيك الكلمة حسب الصعوبة واحصل على نقاط",
  usage: ".تفكيك سهل",

  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    const sender = m.key.participant || m.participant || m.key.remoteJid;
    const args = m.args || [];

    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, { text: '❌ هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: m });
    }

    const level = (args[0] || '').trim();
    if (!validLevels.includes(level)) {
      return sock.sendMessage(chatId, {
        text: `❌ اختر مستوى صحيح:\n🟢 سهل\n🟡 متوسط\n🔴 صعب\n\nمثال: *.تفكيك سهل*`,
        mentions: [sender]
      }, { quoted: m });
    }

    const randomWord = words[level][Math.floor(Math.random() * words[level].length)];
    const separated = randomWord.split('').join(' ');

    await sock.sendMessage(chatId, {
      text: `
•⪼ ⸽ فــعــالـية˼✒️˹ تـفـكـيـك
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*  
*˼🕸️˹⥃المــقــدم﹝عمكم﹞*  
*˼🕸️˹⥃المستوى:* ${level}  
*˼🕸️˹⥃الكلمة:* ${randomWord}  
*˼🕸️˹⥃الوقت:* ${timeMap[level]/1000} ثانية  
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*  
*〘 توقيع إدارة المجموعة ╎⸙ 〙*  
*『مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰❄⊱عمكم』*  
*مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 ❄*`
    }, { quoted: m });

    const correctAnswer = separated;

    const handler = async ({ messages }) => {
      const msg = messages[0];
      const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      const from = msg.key.remoteJid;
      if (from !== chatId) return;

      if (body?.trim() === correctAnswer.trim()) {
        const winner = msg.key.participant || msg.key.remoteJid;
        if (!points[winner]) points[winner] = 0;
        points[winner] += rewardMap[level];
        savePoints();

        clearTimeout(timer);
        sock.ev.off('messages.upsert', handler);

        // هنا النص المزخرف للكلمة والفائز والنقاط
        await sock.sendMessage(chatId, {
          text: `
*❐─━──━〘•🕸️•〙━──━─❐*
*˼🕸️˹⥃الـكــلــمــة:* ${correctAnswer}
*˼🕸️˹⥃الــفــائــز:* @${winner.split('@')[0]}
*˼🕸️˹⥃الــنـقـاط:* ${points[winner]} (+${rewardMap[level]})
*❐─━──━〘•🕸️•〙━──━─❐*
*〘 توقيع إدارة المجموعة ╎⸙ 〙*
*『مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰❄⊱عمكم』*
*مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 ❄*`,
          mentions: [winner]
        }, { quoted: msg });
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timer = setTimeout(() => {
      sock.ev.off('messages.upsert', handler);
      sock.sendMessage(chatId, {
        text: `
*❐─━──━〘•🕸️•〙━──━─❐*
⌛ انتهى الوقت!  
❌ الكلمة كانت: ${correctAnswer}
*❐─━──━〘•🕸️•〙━──━─❐*
*〘 توقيع إدارة المجموعة ╎⸙ 〙*
*『مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰🇾🇪⊱عمكم』*
*مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 🌋*`
      }, { quoted: m });
    }, timeMap[level]);
  }
};