const { addPoints } = require('../data/pointsHelper');

const words = {
  كتاب: 'book',
  سيارة: 'car',
  مدرسة: 'school',
  هاتف: 'phone',
  قلم: 'pen',
};

const arabicWords = Object.keys(words);

module.exports = {
  command: 'ترجمة',
  desc: 'سباق ترجمة كلمة من عربي إلى إنجليزي',
  group: true,
  category: 'ترفيه',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const word = arabicWords[Math.floor(Math.random() * arabicWords.length)];
    const answer = words[word];
    let answered = false;

    await sock.sendMessage(chatId, {
      text: `🌐 ترجم الكلمة التالية إلى الإنجليزية:\n*${word}*\n⏳ لديك 15 ثانية`,
    }, { quoted: msg });

    const onMessage = async ({ messages }) => {
      for (const m of messages) {
        if (m.key.remoteJid !== chatId) continue;
        const body = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
        const resp = body.trim().toLowerCase();

        if (resp === answer && !answered) {
          answered = true;
          sock.ev.off('messages.upsert', onMessage);

          const userName = m.pushName || 'مستخدم';
          const userJid = m.key.participant || m.key.remoteJid;

          addPoints(userJid, 5);

          await sock.sendMessage(chatId, {
            text: `✅ صحيح يا *${userName}*!\nالترجمة: *${answer}*\n🏅 +5 نقاط!`,
          }, { quoted: m });
          break;
        }
      }
    };

    sock.ev.on('messages.upsert', onMessage);

    setTimeout(async () => {
      if (!answered) {
        sock.ev.off('messages.upsert', onMessage);
        await sock.sendMessage(chatId, {
          text: `⌛ انتهى الوقت!\nالإجابة الصحيحة: *${answer}*`,
        }, { quoted: msg });
      }
    }, 15000);
  }
};