const fs = require('fs');
const path = require('path');

const ranksFile = path.join(__dirname, '../data/ranks.json');

function loadRanks() {
  try {
    if (!fs.existsSync(ranksFile)) fs.writeFileSync(ranksFile, '{}');
    return JSON.parse(fs.readFileSync(ranksFile));
  } catch {
    return {};
  }
}

function saveRanks(ranks) {
  fs.writeFileSync(ranksFile, JSON.stringify(ranks, null, 2));
}

module.exports = {
  command: 'لعب',
  async execute(sock, m) {
    const chatId = m.key.remoteJid;

    const questions = [
      { q: "من هو أخ ماريو؟", a: "لويجي" },
      { q: "ما اسم الوحش الذي ينفجر في ماينكرافت؟", a: "كريبر" },
      { q: "ما اسم مدينة جي تي اي في النسخة الشهيرة؟", a: "لوس سانتوس" },
      { q: "من هو بطل لعبة زيلدا؟", a: "لينك" },
      { q: "من هو بطل لعبة ريزدنت إيفل المعروف؟", a: "ليون" },
      { q: "ما اسم بطل جاد اوف وور؟", a: "كريتوس" },
      { q: "ما اسم لعبة البناء الشهيرة؟", a: "ماينكرافت" },
      { q: "من هو صديق سونيك الذكي؟", a: "تايلز" },
      { q: "ما اسم أول لعبة فيديو شهيرة pong بالعربية؟", a: "بونغ" },
      { q: "من هو بطل اساسنز كريد الشهير؟", a: "ايزيو" },
      { q: "ما اسم عالم ماينكرافت السفلي؟", a: "النيذر" },
      { q: "ما نوع لعبة كول اوف ديوتي؟", a: "تصويب" },
      { q: "من هو بطل ذا ويتشر؟", a: "جيرالت" },
      { q: "ما اسم شخصية كراش؟", a: "كراش" },
      { q: "ما اسم عملة لعبة فورتنايت بالعربية؟", a: "في باكس" },
      { q: "من هو مطور لعبة ماينكرافت؟", a: "نوتش" },
      { q: "ما اسم الشرير في لعبة زيلدا؟", a: "غانوندورف" },
      { q: "ما اسم لعبة السيارات الشهيرة؟", a: "نيد فور سبيد" },
      { q: "من هو بطل لعبة متال جير؟", a: "سنيك" },
      { q: "ما اسم لعبة البقاء التي اشتهرت عام 2018؟", a: "فورتنايت" },
      { q: "ما اسم شخصية تومب رايدر؟", a: "لارا" },
      { q: "ما اسم لعبة تحتوي على بوكيمونات؟", a: "بوكيمون" },
      { q: "ما اسم بطل لعبة جود اوف وور القديم؟", a: "كريتوس" },
      { q: "ما اسم الخريطة الشهيرة في ببجي sanhok بالعربية؟", a: "سانهوك" },
      { q: "من هو صانع لعبة ببجي؟", a: "تينسنت" }
    ];

    const qData = questions[Math.floor(Math.random() * questions.length)];

    await sock.sendMessage(chatId, {
      text: `🎮 *سؤال ألعاب:*\n\n${qData.q}\n\n⏳ لديك 30 ثانية للإجابة!
مــجــهــول||⊰𝑩𝑶𝑻⊰𝕲𝕳𝕰𝕯𝕬𝕹⊰ 🌋`
    });

    const correct = qData.a.trim().toLowerCase();

    const handler = async ({ messages }) => {
      for (const msg of messages) {
        if (msg.key.remoteJid !== chatId) continue;
        const text =
          (msg.message?.conversation ||
           msg.message?.extendedTextMessage?.text ||
           '').toLowerCase().trim();
        if (!text) continue;

        if (text === correct) {
          clearTimeout(timeout);
          sock.ev.off('messages.upsert', handler);

          const sender = msg.key.participant;
          const ranks = loadRanks();
          ranks[sender] = (ranks[sender] || 0) + 1;
          saveRanks(ranks);

          await sock.sendMessage(chatId, {
            text: `✅ إجابة صحيحة!\n🏆 الفائز: @${sender.split('@')[0]}\n📊 نقاطك الآن: ${ranks[sender]}
مــجــهــول||⊰𝑩𝑶𝑻⊰𝕲𝕳𝕰𝕯𝕬𝕹⊰ 🌋`,
            mentions: [sender]
          });
          break;
        }
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timeout = setTimeout(() => {
      sock.ev.off('messages.upsert', handler);
      sock.sendMessage(chatId, { text: `⌛ انتهى الوقت!\nالإجابة الصحيحة: *${qData.a}*
مــجــهــول||⊰𝑩𝑶𝑻⊰𝕲𝕳𝕰𝕯𝕬𝕹⊰ 🌋` });
    }, 30000);
  }
};