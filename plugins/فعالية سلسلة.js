const { addPoints } = require('../data/pointsHelper');

const allQuestions = [
  {
    level: 1,
    question: "ما اسم بطل أنمي 'قاتل الشياطين'؟",
    options: ['A. تانجيرو', 'B. زينيتسو', 'C. إينوسكي', 'D. ريو'],
    answer: 'A',
  },
  {
    level: 2,
    question: "ما اسم التقنية التي يستخدمها لوفي؟",
    options: ['A. هاكي', 'B. تشاكرا', 'C. كيوبي', 'D. غينجتسو'],
    answer: 'A',
  },
  {
    level: 3,
    question: "من هو مدرب ناروتو؟",
    options: ['A. كاكاشي', 'B. جيرايا', 'C. إيتاتشي', 'D. أوروتشيمارو'],
    answer: 'A',
  },
  {
    level: 4,
    question: "في أي أنمي يوجد شخصية 'إدوارد إلريك'؟",
    options: ['A. ناروتو', 'B. ون بيس', 'C. الكيميائي المعدني', 'D. هجوم العمالقة'],
    answer: 'C',
  },
  {
    level: 5,
    question: "من هو ملك القراصنة؟",
    options: ['A. لوفي', 'B. غول دي روجر', 'C. زورو', 'D. كايدو'],
    answer: 'B',
  },
  // ➕ أضف المزيد حتى 15 أو أكثر
];

module.exports = {
  command: 'سلسلة',
  desc: 'سلسلة أسئلة بدون تكرار 🧠',
  group: true,
  category: 'ترفيه',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const senderJid = msg.key.participant || msg.key.remoteJid;
    const usedIndexes = new Set();
    let currentIndex = -1;
    let score = 0;

    const askNext = async () => {
      const remaining = allQuestions.filter((_, i) => !usedIndexes.has(i));
      if (remaining.length === 0) {
        await sock.sendMessage(chatId, {
          text: `🎉 انتهت الأسئلة!\n🏅 نتيجتك: *${score}* نقطة.\nأرسل الأمر مجددًا للبدء من جديد.`,
        }, { quoted: msg });
        return;
      }

      const index = allQuestions.findIndex((_, i) => !usedIndexes.has(i));
      const q = allQuestions[index];
      usedIndexes.add(index);
      currentIndex = index;

      const text = `
┏━━━━━━✦❘༻✦❘༺✦━━━━━━┓
🧠 *المستوى ${q.level}*
${q.question}

${q.options.join('\n')}

⏱ *لديك 30 ثانية*
✍️ أرسل الحرف الصحيح فقط أو اكتب .انسحب للانسحاب
┗━━━━━━✦❘༻✦❘༺✦━━━━━━┛
`.trim();

      await sock.sendMessage(chatId, { text }, { quoted: msg });

      const onMessage = async ({ messages }) => {
        for (const m of messages) {
          const fromSameChat = m.key.remoteJid === chatId;
          if (!fromSameChat) continue;

          const body = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
          const answer = body.trim().toUpperCase();

          if (answer === '.انسحب') {
            sock.ev.off('messages.upsert', onMessage);
            return sock.sendMessage(chatId, {
              text: `🚪 تم الانسحاب.\n🏅 نتيجتك: *${score}* نقطة.`,
            }, { quoted: m });
          }

          if (['A', 'B', 'C', 'D'].includes(answer)) {
            sock.ev.off('messages.upsert', onMessage);

            if (answer === q.answer) {
              const name = m.pushName || 'مستخدم';
              const userJid = m.key.participant || m.key.remoteJid;
              score += 5;
              addPoints(userJid, 5);

              await sock.sendMessage(chatId, {
                text: `✅ *إجابة صحيحة!* أحسنت يا ${name}!\n🏅 مجموع نقاطك: *${score}*`,
              }, { quoted: m });

              setTimeout(askNext, 1500);
            } else {
              await sock.sendMessage(chatId, {
                text: `❌ *خطأ!* الإجابة الصحيحة كانت: *${q.answer}*`,
              }, { quoted: m });
            }
          }
        }
      };

      sock.ev.on('messages.upsert', onMessage);

      setTimeout(() => {
        sock.ev.off('messages.upsert', onMessage);
        if (!usedIndexes.has(currentIndex)) return;
        sock.sendMessage(chatId, {
          text: `⌛ انتهى الوقت!\n🔍 الإجابة الصحيحة كانت: *${q.answer}*`,
        }, { quoted: msg });
      }, 30000);
    };

    askNext();
  }
};