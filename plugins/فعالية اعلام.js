const fs = require('fs');
const path = require('path');

let isActive = false;
let timeout = null;
const guessTime = 20 * 1000; // 20 ثانية فقط

const statsPath = path.join(__dirname, '../data/statistics.json');

const flags = [
  { emoji: "🇲🇦", country: "المغرب" },
  { emoji: "🇪🇬", country: "مصر" },
  { emoji: "🇩🇿", country: "الجزائر" },
  { emoji: "🇹🇳", country: "تونس" },
  { emoji: "🇸🇦", country: "السعودية" },
  { emoji: "🇦🇪", country: "الإمارات" },
  { emoji: "🇶🇦", country: "قطر" },
  { emoji: "🇯🇴", country: "الأردن" },
  { emoji: "🇮🇶", country: "العراق" },
  { emoji: "🇱🇧", country: "لبنان" },
  { emoji: "🇸🇾", country: "سوريا" }
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function loadJson(filePath, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch {
    return fallback;
  }
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  command: 'اعلام',
  category: '🎮 الألعاب',
  description: 'احزر الدولة من العلم 🌍',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;

    if (isActive) {
      return await sock.sendMessage(chatId, {
        text: '❗ *يوجد علم حاليًا، انتظر حتى ينتهي التحدي.*'
      });
    }

    const stats = loadJson(statsPath);
    const flag = getRandomItem(flags);

    isActive = true;

    const startMessage = `
•⪼ ⸽ فــعــالـية 🕸️˹ احزر الدولة
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*˼🕸️˹⥃العـلـم:* ${flag.emoji}
*˼🕸️˹⥃الوقت:* 20 ثانية فقط
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع إدارة المملكة╎⸙ 〙*
*『عمكم مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹』*
مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 ❄`;

    await sock.sendMessage(chatId, { text: startMessage });

    const onMessage = async ({ messages }) => {
      if (!isActive) return;

      const answerMsg = messages[0];
      const text = answerMsg.message?.conversation?.trim();
      const answerSender = answerMsg.key.participant || answerMsg.key.remoteJid;

      if (!text) return;

      if (text.toLowerCase() === flag.country.toLowerCase()) {
        clearTimeout(timeout);
        isActive = false;
        sock.ev.off('messages.upsert', onMessage);

        stats[answerSender] = (stats[answerSender] || 0) + 1;
        saveJson(statsPath, stats);

        const winMessage = `
•⪼ ⸽ فــعــالـية 🕸️˹ جواب صحيح
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*˼🕸️˹⥃الدولة:* ${flag.country}
*˼🕸️˹⥃الفـائـز:* @${answerSender.split('@')[0]}
*˼🕸️˹⥃نقاطـه:* ${stats[answerSender]}
*✵ ⋅• ┉━ ━⌯﹝❄﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع إدارة المملكة╎⸙ 〙*
*『عمكم مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹』*
مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 ❄
        `;

        await sock.sendMessage(chatId, { text: winMessage, mentions: [answerSender] });
      }
    };

    sock.ev.on('messages.upsert', onMessage);

    timeout = setTimeout(async () => {
      isActive = false;
      sock.ev.off('messages.upsert', onMessage);

      const timeoutMessage = `
•⪼ ⸽ فــعــالـية 🕸️˹ دول اعلام
*✵ ⋅• ┉━ ━⌯﹝❄﹞⌯━ ━┉ •⋅ ✵*
⌛ انتهى الوقت!
*˼🕸️˹⥃الدولة الصحيحة:* ${flag.country}
*✵ ⋅• ┉━ ━⌯﹝❄﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع إدارة المملكة╎⸙ 〙*
*『عمكم مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹』*
مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 ❄`;

      await sock.sendMessage(chatId, { text: timeoutMessage });
    }, guessTime);
  }
};