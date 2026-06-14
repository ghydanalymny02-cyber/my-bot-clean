const fs = require('fs');
const path = require('path');

const pointsFile = path.join(__dirname, '../data/points.json');
const ranksFile = path.join(__dirname, '../data/ranks.json');

if (!fs.existsSync(pointsFile)) fs.writeFileSync(pointsFile, '{}');
if (!fs.existsSync(ranksFile)) fs.writeFileSync(ranksFile, '{}');

function loadJSON(file, fallback = {}) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
  return JSON.parse(fs.readFileSync(file));
}
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getNumber(jid) {
  return jid.split('@')[0];
}
function getLevel(points) {
  if (points >= 1000000) return '👑 ملك النقاط';
  if (points >= 100000) return '🔥 أسطورة';
  if (points >= 10000) return '💎 محترف';
  if (points >= 1000) return '⭐ متقدم';
  if (points >= 200) return '🌱 مبتدئ';
  if (points < -10) return '🪫 نوب';
  return '🌱 مبتدئ';
}

const reward = 50; // نقاط الفوز
const characters = [
  "لوفي", "زورو", "ناروتو", "ساسكي", "غوكو", "فيجيتا", "ليفاي", "إيرين",
  "إيتاتشي", "مادارا", "إيتشيغو", "آيزن", "غون", "كيلوا", "تانجيرو", "نيزوكو",
  "غوجو", "كاكاشي", "هيناتا", "ناتسو", "غراي", "ساتورو", "ريمي", "سايتاما", "جينوس",
  "بوروتو", "ساكورا", "أوبيتو", "دازاي", "توجي", "يوتا"
];

module.exports = {
  command: 'كتابه',
  category: 'ترفيه',
  description: 'فعالية: من يكتب اسم الشخصية أولاً يفوز!',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
    const senderNum = getNumber(sender);

    const selected = characters[Math.floor(Math.random() * characters.length)];

    await sock.sendMessage(chatId, {
      text: `•⪼ ⸽ فــعــالـية 🕸️˹ كتابة\n*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*\n*˼🕸️˹⥃اكتب اسم الشخصية التالية:* "${selected}"\n⏱️ ˼🕸️˹⥃لديك 15 ثانية فقط!`,
      mentions: [sender]
    });

    let ranks = loadJSON(ranksFile, {});
    let points = loadJSON(pointsFile, {});
    let answered = false;

    const handler = async ({ messages }) => {
      if (answered) return;
      for (const reply of messages) {
        if (reply.key.remoteJid !== chatId) continue;
        const txt = reply.message?.conversation || reply.message?.extendedTextMessage?.text || '';
        const replyJid = reply.key.participant || reply.participant || reply.key.remoteJid;
        const replyNum = getNumber(replyJid);

        if (txt.trim() === selected) {
          answered = true;
          ranks[replyNum] = (ranks[replyNum] || 0) + 1;
          points[replyNum] = (points[replyNum] || 0) + reward;
          saveJSON(ranksFile, ranks);
          saveJSON(pointsFile, points);

          await sock.sendMessage(chatId, {
            text: `
•⪼ ⸽ فــعــالـية 🕸️˹ كتابة
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*˼🕸️˹⥃الشخصية:* ${selected}
*˼🕸️˹⥃الفـائـز:* @${replyNum}
*˼🕸️˹⥃نقاطه:* ${points[replyNum]} (+${reward})
*˼🕸️˹⥃رتبته:* ${getLevel(points[replyNum])}
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع المملكة ╎⸙ 〙*
*『مـــجـــهـــول ⊰🇾🇪⊱سيروشيا』*
مـــجـــهـــول 𝑩𝑶𝑻 🌋
            `,
            mentions: [replyJid]
          });

          sock.ev.off('messages.upsert', handler);
          break;
        }
      }
    };

    sock.ev.on('messages.upsert', handler);

    setTimeout(() => {
      if (!answered) {
        sock.ev.off('messages.upsert', handler);
        sock.sendMessage(chatId, {
          text: `
•⪼ ⸽ فــعــالـية 🕸️˹ كتابة
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*˼🕸️˹⥃انتهى الوقت!* ⏰
*˼🕸️˹⥃الشخصية:* ${selected}
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع المملكة ╎⸙ 〙*
*『
مـــجـــهـــول ⊰🇾🇪⊱سيروشيا』*
مـــجـــهـــول 𝑩𝑶𝑻 🌋
        `});
      }
    }, 15000);
  }
};