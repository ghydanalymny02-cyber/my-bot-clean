const fs = require('fs');
const path = require('path');
const images = require('../data/animeTmages');

const pointsFile = path.join(__dirname, '../data/ranks.json');
let points = {};

if (fs.existsSync(pointsFile)) {
  try {
    points = JSON.parse(fs.readFileSync(pointsFile));
  } catch (err) {
    console.error('❌ خطأ في قراءة ملف النقاط:', err);
    points = {};
  }
}

function savePoints() {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

module.exports = {
  command: 'صوره',
  category: 'game',
  description: 'تخمين شخصية هذه الصورة لشخصية أنمي مشهورة، من هي؟',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, { text: '❌ هذا الأمر يعمل فقط في المجموعات.' }, { quoted: msg });
    }

    if (!images.length) {
      return sock.sendMessage(chatId, { text: '❌ لا توجد صور متاحة حالياً.' }, { quoted: msg });
    }

    const image = images[Math.floor(Math.random() * images.length)];

    await sock.sendMessage(chatId, {
      image: { url: image.url },
      caption: `🖼️ تخمين شخصية هذه الصورة لشخصية أنمي مشهورة، من هي؟\n🕒 عندك 15 ثانية!`,
    }, { quoted: msg });

    let answered = false;

    const onMessage = async ({ messages }) => {
      for (const m of messages) {
        const text =
          m.message?.conversation ||
          m.message?.extendedTextMessage?.text ||
          '';

        const isReplyToQuestion = m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

        if (
          m.key.remoteJid === chatId &&
          text.toLowerCase().includes(image.name.toLowerCase()) &&
          !answered &&
          (m.message?.conversation || isReplyToQuestion)
        ) {
          answered = true;

          const sender = m.key.participant || m.key.remoteJid;
          if (!points[sender]) points[sender] = 0;
          points[sender] += 1;
          savePoints();

          await sock.sendMessage(chatId, {
            text: `✅ صح يا نجم! 🥳\n🏆 نقاطك: *${points[sender]}*`,
          }, { quoted: m });

          sock.ev.off('messages.upsert', onMessage);
        }
      }
    };

    sock.ev.on('messages.upsert', onMessage);

    setTimeout(async () => {
      sock.ev.off('messages.upsert', onMessage);
      if (!answered) {
        await sock.sendMessage(chatId, {
          text: `❌ خلص الوقت!\n🔍 الإجابة كانت: *${image.name}*`,
        }, { quoted: msg });
      }
    }, 15000);
  }
};