const fs = require('fs');
const path = require('path');

const ranksFile = path.join(__dirname, '../data/ranks.json');

function loadRanks() {
  try {
    if (!fs.existsSync(ranksFile)) fs.writeFileSync(ranksFile, '{}');
    return JSON.parse(fs.readFileSync(ranksFile));
  } catch {
    return {};
  }
}

function saveRanks(ranks) {
  fs.writeFileSync(ranksFile, JSON.stringify(ranks, null, 2));
}

module.exports = {
  command: 'مفصله',
  async execute(sock, m) {
    const chatId = m.key.remoteJid;

    const words = [
      "يوميلا ييغر",
      "ناروتو اوزوماكي",
      "لولوكا لامبيروج",
      "زورو السياف",
      "تانجيرو كامادو",
      "إيتاتشي أوتشيها",
      "ليفاي أكرمان",
      "سون غوكو",
      "كاكاشي هاتاكي",
      "ريوك الشينيغامي",
      "كانوكي كن",
      "سايتاما البطل",
      "كيلوا زولديك",
      "هيسوكا الساحر",
      "يوغي موتو"
    ];

    const word = words[Math.floor(Math.random() * words.length)];
    const correctAnswer = word.split('').join(' ').replace(/\s+/g, ' ').trim().toLowerCase();

    await sock.sendMessage(chatId, {
      text: `🧩 فكّ الكلمة التالية بالحروف وفصلها بمسافات:\n\n*${word}*\n\n⏳ لديك 30 ثانية!`
    });

    const handler = async ({ messages }) => {
      for (const msg of messages) {
        if (msg.key.remoteJid !== chatId) continue;

        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          '';

        const answer = text.replace(/\s+/g, ' ').trim().toLowerCase();

        if (answer === correctAnswer) {
          clearTimeout(timeout);
          sock.ev.off('messages.upsert', handler);

          const sender = msg.key.participant;
          const ranks = loadRanks();
          ranks[sender] = (ranks[sender] || 0) + 1;
          saveRanks(ranks);

          await sock.sendMessage(chatId, {
            text: `✅ إجابة صحيحة!\n🏆 الفائز: @${sender.split('@')[0]}\n📊 نقاطك: ${ranks[sender]}`,
            mentions: [sender]
          });

          break;
        }
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timeout = setTimeout(() => {
      sock.ev.off('messages.upsert', handler);
      sock.sendMessage(chatId, {
        text: `⌛ انتهى الوقت!\nالإجابة كانت:\n*${correctAnswer}*`
      });
    }, 30000);
  }
};