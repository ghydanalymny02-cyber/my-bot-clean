const fs = require('fs');
const path = require('path');

const words = [
  "ناروتو", "ساسكي", "كيوبي", "شارينغان", "ميكاسا", "إيرين", "لوفي", "زورو",
  "تشوبر", "غوكو", "فيجيتا", "غون", "كيلوا", "هيسوكا", "تانجيرو", "نيزوكو",
  "سايتاما", "جينوس", "دراجون", "نيجي", "هيناتا", "شينوبو", "لاك", "يوتا"
];

const pointsFile = path.join(__dirname, '../data/ranks.json');
let points = {};

// تحميل النقاط
if (fs.existsSync(pointsFile)) {
  points = JSON.parse(fs.readFileSync(pointsFile));
}

// حفظ النقاط
function savePoints() {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

// تحديد المستوى
function getLevel(points) {
  if (points >= 1000000) return '👑 ملك النقاط';
  if (points >= 100000) return '🔥 أسطورة';
  if (points >= 10000) return '💎 محترف';
  if (points >= 1000) return '⭐ متقدم';
  if (points >= 200) return '🌱 مبتدئ';
  if (points < -10) return '🪫 نوب';
  return '🌱 مبتدئ';
}

module.exports = {
  command: "سريع",
  category: "game",
  description: "أول من يكتب الكلمة التي أرسلها البوت يفوز",

  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    const sender = m.key.participant || m.participant || m.key.remoteJid;
    const senderNum = sender.split('@')[0];

    const word = words[Math.floor(Math.random() * words.length)];

    await sock.sendMessage(chatId, {
      text: `•⪼ ⸽ فــعــالـية 🕸️˹ سريع\n*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*\n*˼🕸️˹⥃اكتب الكلمة التالية:* "${word}"\n⏱️ ˼🕸️˹⥃لديك 30 ثانية فقط!`,
      mentions: [sender]
    });

    let answered = false;

    const handler = async ({ messages }) => {
      if (answered) return;
      for (const msg of messages) {
        if (msg.key.remoteJid !== chatId) continue;
        const txt = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        const replyJid = msg.key.participant || msg.participant || msg.key.remoteJid;
        const replyNum = replyJid.split('@')[0];

        if (txt.trim() === word) {
          answered = true;

          points[replyNum] = (points[replyNum] || 0) + 1;
          savePoints();

          await sock.sendMessage(chatId, {
            text: `
•⪼ ⸽ فــعــالـية 🕸️˹ سريع
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*˼🕸️˹⥃الكلمة:* ${word}
*˼🕸️˹⥃الفـائـز:* @${replyNum}
*˼🕸️˹⥃نقاطه:* ${points[replyNum]}
*˼🕸️˹⥃رتبته:* ${getLevel(points[replyNum])}
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع المملكة ╎⸙ 〙*
*『𝐒.𝐋.𝐕⊰❄⊱سيلفر』*
𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻 ❄
            `,
            mentions: [replyJid]
          });

          sock.ev.off('messages.upsert', handler);
          break;
        }
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timer = setTimeout(() => {
      if (!answered) {
        sock.ev.off('messages.upsert', handler);
        sock.sendMessage(chatId, {
          text: `
•⪼ ⸽ فــعــالـية 🕸️˹ سريع
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*˼🕸️˹⥃انتهى الوقت!* ⏰
*˼🕸️˹⥃الكلمة:* ${word}
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع المملكة ╎⸙ 〙*
*『𝐒.𝐋.𝐕⊰❄⊱سيلفر』*
𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻 ❄
        `});
      }
    }, 30000);
  }
};