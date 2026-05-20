const { addPoints } = require('../data/pointsHelper');

const sentences = [
  'الذكاء الاصطناعي يغير العالم',
  'القراءة مفتاح المعرفة',
  'الصبر مفتاح الفرج',
  'العلم نور والجهل ظلام',
  'الوحدة خير من جليس السوء',
  'من جد وجد ومن زرع حصد'
];

function shuffleWords(sentence) {
  const words = sentence.split(' ');
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words.join(' ');
}

module.exports = {
  command: 'رتب',
  description: '🎯 رتب الجملة المبعثرة خلال 30 ثانية!',
  group: true,
  category: 'ترفيه',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const original = sentences[Math.floor(Math.random() * sentences.length)];
    const scrambled = shuffleWords(original);
    let answered = false;

    await sock.sendMessage(chatId, {
      text: `🧩 رتب الكلمات لتكوين جملة صحيحة:\n\n${scrambled}\n\n⏳ لديك 30 ثانية!`,
    }, { quoted: msg });

    const onMessage = async ({ messages }) => {
      for (const m of messages) {
        if (m.key.remoteJid !== chatId) continue;

        const body = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
        const userAnswer = body.trim();

        if (userAnswer === original && !answered) {
          answered = true;
          sock.ev.off('messages.upsert', onMessage);

          const userName = m.pushName || 'مستخدم';
          const userJid = m.key.participant || m.key.remoteJid;

          addPoints(userJid, 10);

          await sock.sendMessage(chatId, {
            text: `🎉 أحسنت يا *${userName}*!\n✅ الجملة: *${original}*\n🏅 +10 نقاط!`,
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
          text: `⌛ انتهى الوقت!\n📌 الجملة الصحيحة كانت:\n*${original}*`,
        }, { quoted: msg });
      }
    }, 30000);
  }
};