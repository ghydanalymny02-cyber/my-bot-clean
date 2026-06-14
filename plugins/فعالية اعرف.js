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

const rewardMap = { سهل: 50, متوسط: 100, صعب: 200 };
const penaltyMap = { سهل: 50, متوسط: 100, صعب: 200 };
const timeMap = { سهل: 10000, متوسط: 15000, صعب: 20000 };

const images = {
  سهل: path.join(__dirname, '../media/characters/'),
  متوسط: path.join(__dirname, '../media/characters/'),
  صعب: path.join(__dirname, '../media/characters/'),
};

module.exports = {
  command: 'اعرف',
  description: '👀 لعبة: خمن الشخصية من الصورة مع مستويات',
  usage: '.اعرف سهل',
  category: 'fun',

  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    const sender = m.key.participant || m.participant || m.key.remoteJid;
    const senderNum = getNumber(sender);
    const args = m.args || [];
    const level = args[0]?.trim() || 'سهل';
    const validLevels = ['سهل', 'متوسط', 'صعب'];

    if (!validLevels.includes(level)) {
      return sock.sendMessage(chatId, {
        text: `❌ *المستوى غير صحيح!*\nاختر:\n🟢 سهل\n🟡 متوسط\n🔴 صعب\nمثال: *.اعرف سهل*`,
      });
    }

    const folder = images[level];
    if (!fs.existsSync(folder)) return sock.sendMessage(chatId, { text: `📂 المجلد غير موجود: ${folder}` });

    const files = fs.readdirSync(folder).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    if (files.length === 0) return sock.sendMessage(chatId, { text: '❌ لا توجد صور في هذا المستوى.' });

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const filePath = path.join(folder, randomFile);
    const correctAnswer = path.basename(randomFile, path.extname(randomFile)).trim();

    await sock.sendMessage(chatId, {
      image: fs.readFileSync(filePath),
      caption: `👀 ˼🕸️˹⥃خمن الشخصية من الصورة [${level}]!\n⏳ ˼🕸️˹⥃الوقت: ${timeMap[level]/1000} ثواني\n🙋‍♂️ ˼🕸️˹⥃اللاعب: @${senderNum}`,
      mentions: [sender]
    });

    let ranks = loadJSON(ranksFile, {});
    let points = loadJSON(pointsFile, {});
    let winnerFound = false;

    const handler = async ({ messages }) => {
      if (winnerFound) return;
      for (const msg of messages) {
        if (msg.key.remoteJid !== chatId) continue;
        const txt = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        if (txt.trim().toLowerCase() === correctAnswer.toLowerCase()) {
          clearTimeout(timeout);
          sock.ev.off('messages.upsert', handler);

          const winner = msg.key.participant || msg.participant || msg.key.remoteJid;
          const winnerNum = getNumber(winner);

          ranks[winnerNum] = (ranks[winnerNum] || 0) + 1;
          points[winnerNum] = (points[winnerNum] || 0) + rewardMap[level];

          saveJSON(ranksFile, ranks);
          saveJSON(pointsFile, points);

          winnerFound = true;

          await sock.sendMessage(chatId, {
            text: `
•⪼ ⸽ فــعــالـية 🕸️˹ اعرف [${level}]
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*˼🕸️˹⥃الشخصية:* ${correctAnswer}
*˼🕸️˹⥃الفـائـز:* @${winnerNum}
*˼🕸️˹⥃نقاطه:* ${points[winnerNum]} (+${rewardMap[level]})
*˼🕸️˹⥃رتبته:* ${getLevel(points[winnerNum])}
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع المملكة ╎⸙ 〙*
*『مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹』*
مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 ❄
            `,
            mentions: [winner]
          });
          break;
        }
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timeout = setTimeout(() => {
      if (!winnerFound) {
        sock.ev.off('messages.upsert', handler);
        points[senderNum] = (points[senderNum] || 0) - penaltyMap[level];
        saveJSON(pointsFile, points);

        sock.sendMessage(chatId, {
          text: `
•⪼ ⸽ فــعــالـية 🕸️˹ اعرف [${level}]
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*˼🕸️˹⥃انتهى الوقت!* ⏰
*˼🕸️˹⥃الشخصية:* ${correctAnswer}
*˼🕸️˹⥃نقاطك:* ${points[senderNum]}
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع المملكة ╎⸙ 〙*
*『Y.M.N⊰🇾🇪⊱يمنيوشيا』*
مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 🌋
        `,
          mentions: [sender]
        });
      }
    }, timeMap[level]);
  }
};