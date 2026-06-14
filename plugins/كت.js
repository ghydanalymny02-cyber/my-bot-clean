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

module.exports = {
  command: "كت",
  category: "ترفيه",
  description: "أول من يكتب الكلمة التي أرسلها البوت يفوز",

  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, { text: '❌ هذا الأمر يعمل فقط في الجروبات.' }, { quoted: m });
    }

    const word = words[Math.floor(Math.random() * words.length)];

    await sock.sendMessage(chatId, {
      text: `🎯 أول واحد يكتب الكلمة التالية بشكل صحيح هو الفائز:\n\n❖ *${word}*`
    }, { quoted: m });

    const correctAnswer = word;

    const handler = async ({ messages }) => {
      const msg = messages[0];
      const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      const from = msg.key.remoteJid;
      if (from !== chatId) return;

      if (body?.trim() === correctAnswer) {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!points[sender]) points[sender] = 0;
        points[sender] += 1;
        savePoints();

        clearTimeout(timer);
        sock.ev.off('messages.upsert', handler);

        await sock.sendMessage(chatId, {
          text: `✅ أسرع واحد كتب الكلمة هو: @${sender.split('@')[0]}\n🧠 الكلمة كانت: *${correctAnswer}*\n🏆 نقاطك: *${points[sender]}*`,
          mentions: [sender]
        }, { quoted: msg });
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timer = setTimeout(() => {
      sock.ev.off('messages.upsert', handler);
      sock.sendMessage(chatId, { text: `⌛ انتهى الوقت!\n❌ محدش كتب الكلمة.\n📌 الكلمة كانت: *${correctAnswer}*` }, { quoted: m });
    }, 30000);
  }
};