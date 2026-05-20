const riddles = require('../data/meenana'); // ملف فيه الشخصيات والوصف
const fs = require('fs');
const path = require('path');

const pointsFile = path.join(__dirname, '../data/ranks.json');
let points = {};

if (fs.existsSync(pointsFile)) {
  points = JSON.parse(fs.readFileSync(pointsFile));
}

function savePoints() {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

module.exports = {
  command: 'مين-انا',
  category: 'ترفيه',
  description: 'وصف شخصية وعلى المستخدم تخمين من هي.',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ هذا الأمر يعمل فقط في المجموعات.'
      }, { quoted: msg });
    }

    const riddle = riddles[Math.floor(Math.random() * riddles.length)];

    await sock.sendMessage(chatId, {
      text: `🧠 *مين أنا؟*\n\n${riddle.description}\n\n⏳ لديك 15 ثانية لتخمين الشخصية!`,
    }, { quoted: msg });

    const filter = m =>
      m.key.remoteJid === chatId &&
      m.message &&
      m.message.conversation &&
      m.message.conversation.toLowerCase().includes(riddle.name.toLowerCase());

    const onMessage = async ({ messages }) => {
      const reply = messages.find(filter);
      if (reply) {
        const sender = reply.key.participant || reply.key.remoteJid;

        if (!points[sender]) points[sender] = 0;
        points[sender] += 1;
        savePoints();

        await sock.sendMessage(chatId, {
          text: `✅ إجابة صحيحة!\n🏆 رصيدك الآن: *${points[sender]}* نقطة.`,
        }, { quoted: reply });

        sock.ev.off('messages.upsert', onMessage);
        clearTimeout(timeout);
      }
    };

    sock.ev.on('messages.upsert', onMessage);

    const timeout = setTimeout(async () => {
      sock.ev.off('messages.upsert', onMessage);
      await sock.sendMessage(chatId, {
        text: `❌ انتهى الوقت أو مفيش حد جاوب صح.\n✅ الإجابة الصحيحة كانت: *${riddle.name}*`
      }, { quoted: msg });
    }, 15000);
  }
};