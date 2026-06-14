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
  command: 'تخمين_صوره',
  async execute(sock, m) {
    const chatId = m.key.remoteJid;

    const characters = [
      { name: "ناروتو", image: "https://i.imgur.com/QpZFk0H.jpg" },
      { name: "ساسكي", image: "https://i.imgur.com/knmA15O.jpg" },
      { name: "غوكو", image: "https://i.imgur.com/V4BnJrB.jpg" },
      { name: "لوفي", image: "https://i.imgur.com/7dMVi8B.jpg" },
      { name: "تانجيرو", image: "https://i.imgur.com/9Wmn7Oy.jpg" },
      { name: "سايتاما", image: "https://i.imgur.com/S9ukjtw.jpg" },
      { name: "إيتاتشي", image: "https://i.imgur.com/bfdV4Kp.jpg" },
      { name: "ليفاي", image: "https://i.imgur.com/pM3AJjA.jpg" },
      { name: "هيسوكا", image: "https://i.imgur.com/NrOEJom.jpg" },
      { name: "زينيتسو", image: "https://i.imgur.com/9v9cYOg.jpg" }
    ];

    const random = characters[Math.floor(Math.random() * characters.length)];
    const correctAnswer = random.name.trim().toLowerCase();

    await sock.sendMessage(chatId, {
      image: { url: random.image },
      caption: `🖼️ خمن من هذه الشخصية!\n⏳ لديك 30 ثانية فقط!`
    });

    const handler = async ({ messages }) => {
      for (const msg of messages) {
        if (msg.key.remoteJid !== chatId) continue;

        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          '';

        if (text.trim().toLowerCase() === correctAnswer) {
          clearTimeout(timeout);
          sock.ev.off('messages.upsert', handler);

          const sender = msg.key.participant;
          const ranks = loadRanks();
          ranks[sender] = (ranks[sender] || 0) + 1;
          saveRanks(ranks);

          await sock.sendMessage(chatId, {
            text: `✅ صحيح! الشخصية هي *${random.name}*.\n🏆 الفائز: @${sender.split('@')[0]}\n📊 نقاطك: ${ranks[sender]}`,
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
        text: `⌛ انتهى الوقت!\nالإجابة الصحيحة كانت: *${random.name}*`
      });
    }, 30000);
  }
};