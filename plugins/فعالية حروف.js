const words = [
  "ناروتو", "ساسكي", "كيوبي", "شارينغان", "ميكاسا", "إيرين", "لوفي", "زورو",
  "تشوبر", "غوكو", "فيجيتا", "غون", "كيلوا", "هيسوكا", "تانجيرو", "نيزوكو",
  "سايتاما", "جينوس", "دراجون", "نيجي", "هيناتا", "شينوبو", "لاك", "يوتا"
];

const fs = require('fs');
const path = require('path');
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

// تحديد المستوى حسب النقاط
function getLevel(points) {
  if (points >= 1000) return '⭐ متقدم';
  if (points >= 500) return '💎 محترف';
  if (points >= 200) return '🌱 مبتدئ';
  if (points < 0) return '🪫 نوب';
  return '🌱 مبتدئ';
}

module.exports = {
  command: "حروف",
  category: "game",
  description: "لعبة ترتيب الحروف مع نظام نقاط ومستوى",

  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, { text: '❌ هذا الأمر يعمل فقط في المملكة.' }, { quoted: m });
    }

    const randomWord = words[Math.floor(Math.random() * words.length)];
    const shuffled = randomWord.split('').sort(() => Math.random() - 0.5).join(' ');

    await sock.sendMessage(chatId, {
      text: `•⪼ ⸽ ˼🕸️˹⥃ *فعالية ترتيب الحروف*\n*˼🕸️˹⥃ الكلمة:* *${shuffled}*\n⏳ لديك 30 ثانية فقط!`
    }, { quoted: m });

    const correctAnswer = randomWord;

    let answered = false;

    const handler = async ({ messages }) => {
      if (answered) return;
      const msg = messages[0];
      const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      const from = msg.key.remoteJid;
      if (from !== chatId) return;

      if (body?.trim().toLowerCase() === correctAnswer.toLowerCase()) {
        answered = true;
        const sender = msg.key.participant || msg.key.remoteJid;
        points[sender] = (points[sender] || 0) + 1;
        savePoints();

        sock.ev.off('messages.upsert', handler);

        await sock.sendMessage(chatId, {
          text: `•⪼ ⸽ ˼🕸️˹⥃ *تم حل الكلمة!*\n*˼🕸️˹⥃ الكلمة:* *${correctAnswer}*\n*˼🕸️˹⥃ الفائز:* @${sender.split('@')[0]}\n*˼🕸️˹⥃ نقاطه:* ${points[sender]}\n*˼🕸️˹⥃ مستواه:* ${getLevel(points[sender])}`,
          mentions: [sender]
        }, { quoted: msg });
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timer = setTimeout(() => {
      if (!answered) {
        sock.ev.off('messages.upsert', handler);
        sock.sendMessage(chatId, {
          text: `⌛ انتهى الوقت!\n❌ الكلمة كانت: *${correctAnswer}*`
        }, { quoted: m });
      }
    }, 30000);
  }
};