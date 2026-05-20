const { addPoints } = require('../data/pointsHelper');

const meanings = {
  كتاب: 'مجموعة من الصفحات المكتوبة',
  هاتف: 'جهاز للاتصال الصوتي',
  مدرسة: 'مكان لتعليم الطلاب',
  قميص: 'ثوب يرتدى للجسم العلوي',
  ساعة: 'جهاز لمعرفة الوقت',
};

const words = Object.keys(meanings);

module.exports = {
  command: 'معنى',
  desc: 'سباق إعطاء معنى الكلمة',
  group: true,
  category: 'ترفيه',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const word = words[Math.floor(Math.random() * words.length)];
    const correctMeaning = meanings[word];
    let answered = false;

    await sock.sendMessage(chatId, {
      text: `📚 ما معنى كلمة *${word}*؟\n⏳ لديك 15 ثانية`,
    }, { quoted: msg });

    const onMessage = async ({ messages }) => {
      for (const m of messages) {
        if (m.key.remoteJid !== chatId) continue;
        const body = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
        const resp = body.trim();

        // نقارن بطريقة بسيطة: لو الرد يحتوي كلمات مهمة من المعنى
        if (resp.includes(correctMeaning.split(' ')[0]) && !answered) {
          answered = true;
          sock.ev.off('messages.upsert', onMessage);

          const userName = m.pushName || 'مستخدم';
          const userJid = m.key.participant || m.key.remoteJid;

          addPoints(userJid, 5);

          await sock.sendMessage(chatId, {
            text: `🎉 أحسنت يا *${userName}*!\n🏅 +5 نقاط لك!`,
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
          text: `⌛ انتهى الوقت! المعنى الصحيح:\n*${correctMeaning}*`,
        }, { quoted: msg });
      }
    }, 15000);
  }
};