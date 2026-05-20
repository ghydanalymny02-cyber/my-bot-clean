const { addPoints } = require('../data/pointsHelper');

const symbols = ['🔥', '💧', '⚡', '🌪', '🌟', '🍀', '🧠', '👁️', '🌀', '🌈'];

function getRandomSequence(length) {
  let seq = [];
  for (let i = 0; i < length; i++) {
    seq.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  return seq;
}

module.exports = {
  command: 'تسلسل',
  desc: '🧠 لعبة ذكاء: أعد كتابة تسلسل الرموز بدقة خلال 30 ثانية!',
  group: true,
  category: 'ترفيه',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const sequenceLength = 4 + Math.floor(Math.random() * 3); // بين 4 و6 رموز
    const sequence = getRandomSequence(sequenceLength);
    const sequenceStr = sequence.join(' ');
    let answered = false;

    await sock.sendMessage(chatId, {
      text: `📌 احفظ هذا التسلسل جيدًا:\n\n${sequenceStr}\n\n⏳ لديك 30 ثانية لإعادة إرساله بنفس الترتيب!`,
    }, { quoted: msg });

    const onMessage = async ({ messages }) => {
      for (const m of messages) {
        if (m.key.remoteJid !== chatId) continue;
        const body = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
        const resp = body.trim();

        if (resp === sequenceStr && !answered) {
          answered = true;
          sock.ev.off('messages.upsert', onMessage);

          const userName = m.pushName || 'مستخدم';
          const userJid = m.key.participant || m.key.remoteJid;

          addPoints(userJid, 10);

          await sock.sendMessage(chatId, {
            text: `✅ إجابة صحيحة يا *${userName}*!\n🏅 +10 نقاط!`,
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
          text: `❌ انتهى الوقت!\nكان لازم ترسل: ${sequenceStr}`,
        }, { quoted: msg });
      }
    }, 30000); // ⏱️ 30 ثانية هنا
  }
};