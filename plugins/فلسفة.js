const { addPoints } = require('../data/pointsHelper');

const philosophicalQuestion = {
  question: "🧠 من هو على حق؟\n1️⃣ من يتبع الحقيقة ولو كانت قاسية\n2️⃣ من يعيش في وهم مريح\n\nأرسل *1* أو *2* للإجابة.\n⏳ لديك 30 ثانية للتفكير...",
  correct: "1", // نعتبر الخيار الأول هو "الإجابة المثالية"
};

module.exports = {
  command: 'فلسفة',
  desc: '🧠 سؤال فلسفي صعب جدًا!',
  category: 'ترفيه',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    let answered = false;

    await sock.sendMessage(chatId, {
      text: philosophicalQuestion.question
    }, { quoted: msg });

    const onMessage = async ({ messages }) => {
      for (const m of messages) {
        if (m.key.remoteJid !== chatId) continue;
        const body = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
        const resp = body.trim();

        if ((resp === "1" || resp === "2") && !answered) {
          answered = true;
          sock.ev.off('messages.upsert', onMessage);

          const userName = m.pushName || 'مستخدم';
          const userJid = m.key.participant || m.key.remoteJid;

          if (resp === philosophicalQuestion.correct) {
            addPoints(userJid, 10);
            await sock.sendMessage(chatId, {
              text: `✅ إجابة عميقة يا *${userName}*!\n🏅 +10 نقاط لفهمك الفلسفي.`
            }, { quoted: m });
          } else {
            await sock.sendMessage(chatId, {
              text: `🤔 إجابة مثيرة للتفكير يا *${userName}*!\nلكن الإجابة الأقرب للحقيقة كانت: *${philosophicalQuestion.correct}*`
            }, { quoted: m });
          }

          break;
        }
      }
    };

    sock.ev.on('messages.upsert', onMessage);

    setTimeout(async () => {
      if (!answered) {
        sock.ev.off('messages.upsert', onMessage);
        await sock.sendMessage(chatId, {
          text: `⌛ انتهى الوقت!\nالإجابة المثالية: *${philosophicalQuestion.correct}*`
        }, { quoted: msg });
      }
    }, 30000);
  }
};