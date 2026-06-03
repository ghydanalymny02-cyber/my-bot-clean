const fs = require('fs');
const path = require('path');

const pointsFile = path.join(__dirname, '../data/points.json');
const ranksFile = path.join(__dirname, '../data/ranks.json');

// ✅ تحميل / حفظ JSON
function loadJSON(file, fallback) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
  return JSON.parse(fs.readFileSync(file));
}
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ✅ استخراج الرقم من JID
function getNumber(jid) { return jid.split('@')[0]; }

// ✅ تحديد المستوى
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
  سهل: path.join(__dirname, '../resources/easy'),
  متوسط: path.join(__dirname, '../resources/med'),
  صعب: path.join(__dirname, '../resources/hard'),
};

module.exports = {
  command: 'عيون',
  description: '👀 لعبة: خمن الشخصية من الصورة!\n💡 أرسل .عيون [سهل | متوسط | صعب]',
  usage: '.عيون سهل',
  category: 'fun',

  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    const senderJid = m.key.participant || m.participant || m.key.remoteJid;
    const senderNum = getNumber(senderJid);
    const args = m.args || [];
    const validLevels = ['سهل', 'متوسط', 'صعب'];
    const inputLevel = (args?.[0] || '').trim();

    if (!validLevels.includes(inputLevel)) {
      return await sock.sendMessage(chatId, {
        text: `❌ *المستوى غير صحيح!*\nاختر:\n🟢 سهل\n🟡 متوسط\n🔴 صعب\n\nمثال: *.عيون سهل*`,
      });
    }

    const folder = images[inputLevel];
    if (!fs.existsSync(folder)) return await sock.sendMessage(chatId, { text: `📂 المجلد غير موجود: ${folder}` });
    const files = fs.readdirSync(folder).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    if (files.length === 0) return await sock.sendMessage(chatId, { text: '❌ لا توجد صور في هذا المستوى.' });

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const filePath = path.join(folder, randomFile);
    const correctAnswer = path.basename(randomFile, path.extname(randomFile)).trim();

    await sock.sendMessage(chatId, {
      image: fs.readFileSync(filePath),
      caption: `•⪼ ⸽ ˼🕸️˹⥃ خمن الشخصية من العين!\n*˼🕸️˹⥃ لديك:* ${timeMap[inputLevel]/1000} ثانية\n*˼🕸️˹⥃ اللاعب:* @${senderNum}\n\n- مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰𝑩𝑶𝑻 ❄`,
      mentions: [senderJid]
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

          const winnerJid = msg.key.participant || msg.participant || msg.key.remoteJid;
          const winnerNum = getNumber(winnerJid);

          // تحديث النقاط والرتب
          ranks[winnerNum] = (ranks[winnerNum] || 0) + 1;
          points[winnerNum] = (points[winnerNum] || 0) + rewardMap[inputLevel];
          saveJSON(ranksFile, ranks);
          saveJSON(pointsFile, points);

          winnerFound = true;

          await sock.sendMessage(chatId, {
            text: `•⪼ ⸽ ˼🕸️˹⥃ ✅ إجابة صحيحة!\n*˼🕸️˹⥃ الفائز:* @${winnerNum}\n*˼🕸️˹⥃ الشخصية:* ${correctAnswer}\n*˼🕸️˹⥃ نقاطه:* ${points[winnerNum]} (+${rewardMap[inputLevel]})\n*˼🕸️˹⥃ رتبتك:* ${getLevel(points[winnerNum])}\n\n- مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰𝑩𝑶𝑻 ❄`,
            mentions: [winnerJid]
          });
          break;
        }
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timeout = setTimeout(() => {
      if (!winnerFound) {
        sock.ev.off('messages.upsert', handler);
        points[senderNum] = (points[senderNum] || 0) - penaltyMap[inputLevel];
        saveJSON(pointsFile, points);

        sock.sendMessage(chatId, {
          text: `•⪼ ⸽ ˼🕸️˹⥃ ⏰ انتهى الوقت!\n*˼🕸️˹⥃ الشخصية كانت:* ${correctAnswer}\n*˼🕸️˹⥃ تم خصم:* ${penaltyMap[inputLevel]} نقطة\n*˼🕸️˹⥃ نقاطك الآن:* ${points[senderNum]}\n\n- مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰𝑩𝑶𝑻 ❄`,
          mentions: [senderJid]
        });
      }
    }, timeMap[inputLevel]);
  }
};