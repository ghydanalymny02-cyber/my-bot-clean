const { addPoints } = require('../data/pointsHelper');

const quotes = [
  {
    level: 1,
    quote: "🗣️ *العدالة ستسود في النهاية، حتى إن تأخرت.*",
    options: ['A. ناروتو', 'B. لوفي', 'C. كاكاشي', 'D. إيروين'],
    answer: 'D',
  },
  {
    level: 2,
    quote: "🗣️ *لا توجد طريقة مختصرة لتحقيق الحلم.*",
    options: ['A. تانجيرو', 'B. ميناتو', 'C. إيتاتشي', 'D. إدوارد إلريك'],
    answer: 'C',
  },
  {
    level: 3,
    quote: "🗣️ *أنا سأصبح ملك القراصنة!*",
    options: ['A. زورو', 'B. لوفي', 'C. شانكس', 'D. غول دي روجر'],
    answer: 'B',
  },
  {
    level: 4,
    quote: "🗣️ *الخوف هو العدو الحقيقي.*",
    options: ['A. هيسوكا', 'B. كورابيكا', 'C. كاكاشي', 'D. جارا'],
    answer: 'C',
  },
  {
    level: 5,
    quote: "🗣️ *لا تتراجع عن كلامك، هذه هي طريقتي في النينجا!*",
    options: ['A. ناروتو', 'B. ساسكي', 'C. ساكورا', 'D. مادارا'],
    answer: 'A',
  }
];

module.exports = {
  command: 'القائل',
  description: 'لعبة من القائل؟ 🎙️',
  group: true,
  category: 'ترفيه',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const senderJid = msg.key.participant || msg.key.remoteJid;
    const used = new Set();
    let score = 0;

    const nextQuote = async () => {
      const remaining = quotes.filter((_, i) => !used.has(i));
      if (!remaining.length) {
        return sock.sendMessage(chatId, {
          text: `🎊 انتهت اللعبة! نتيجتك: *${score}* نقطة!`,
        }, { quoted: msg });
      }

      const index = quotes.findIndex((_, i) => !used.has(i));
      const q = quotes[index];
      used.add(index);

      const message = `
╭━━ ❖ ❖ ❖━━━╮
${q.quote}

${q.options.join('\n')}

🎯 المستوى: ${q.level}
⏱ *30 ثانية*
✍️ أرسل الحرف الصحيح أو .انسحب للخروج
╰━━ ❖ ❖ ❖━━━╯
      `.trim();

      await sock.sendMessage(chatId, { text: message }, { quoted: msg });

      const onMessage = async ({ messages }) => {
        for (const m of messages) {
          if (m.key.remoteJid !== chatId) continue;
          const body = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
          const answer = body.trim().toUpperCase();

          if (answer === '.انسحب') {
            sock.ev.off('messages.upsert', onMessage);
            return sock.sendMessage(chatId, {
              text: `🚪 انسحبت! نقاطك: *${score}*`,
            }, { quoted: m });
          }

          if (['A', 'B', 'C', 'D'].includes(answer)) {
            sock.ev.off('messages.upsert', onMessage);

            if (answer === q.answer) {
              const user = m.key.participant || m.key.remoteJid;
              const name = m.pushName || 'مستخدم';
              addPoints(user, 5);
              score += 5;

              await sock.sendMessage(chatId, {
                text: `✅ إجابة صحيحة يا *${name}*!\n🏅 مجموعك: *${score}* نقطة.`,
              }, { quoted: m });

              setTimeout(nextQuote, 1500);
            } else {
              await sock.sendMessage(chatId, {
                text: `❌ خطأ! الإجابة كانت: *${q.answer}*`,
              }, { quoted: m });
            }
          }
        }
      };

      sock.ev.on('messages.upsert', onMessage);

      setTimeout(() => {
        sock.ev.off('messages.upsert', onMessage);
        sock.sendMessage(chatId, {
          text: `⌛ انتهى الوقت! الإجابة كانت: *${q.answer}*`,
        }, { quoted: msg });
      }, 30000);
    };

    nextQuote();
  }
};