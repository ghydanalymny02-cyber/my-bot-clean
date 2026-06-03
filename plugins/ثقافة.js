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
  command: 'ثقافة',
  async execute(sock, m) {
    const chatId = m.key.remoteJid;

    const questions = [
      { q: "ما هي عاصمة اليابان؟", a: "طوكيو" },
      { q: "كم عدد قارات العالم؟", a: "7" },
      { q: "ما هو أطول نهر في العالم؟", a: "النيل" },
      { q: "من اكتشف جاذبية الأرض؟", a: "نيوتن" },
      { q: "ما هي عملة الولايات المتحدة؟", a: "دولار" },
      { q: "كم عدد حروف اللغة العربية؟", a: "28" },
      { q: "ما اسم أكبر محيط في العالم؟", a: "المحيط الهادي" },
      { q: "من أول من مشى على القمر؟", a: "نيل ارمسترونغ" },
      { q: "ما اسم الكوكب الأحمر؟", a: "المريخ" },
      { q: "ما هي لغة البرازيل؟", a: "البرتغالية" },
      { q: "في أي قارة تقع مصر؟", a: "افريقيا" },
      { q: "ما هو رمز العنصر للماء؟", a: "h2o" },
      { q: "كم عدد أيام السنة التقريبية؟", a: "365" },
      { q: "من هو مؤسس مايكروسوفت؟", a: "بيل غيتس" },
      { q: "ما اسم البحر الذي يفصل بين أوروبا وأفريقيا؟", a: "البحر المتوسط" },
      { q: "كم عدد ألوان قوس قزح؟", a: "7" },
      { q: "من هو مؤسس فيسبوك؟", a: "مارك زوكربيرغ" },
      { q: "ما اسم أكبر قارة؟", a: "آسيا" },
      { q: "ما هو الحيوان الذي يملك رقبة طويلة؟", a: "الزرافة" },
      { q: "من أول نبي في الإسلام؟", a: "آدم" },
      { q: "ما اسم العاصمة الجزائرية؟", a: "الجزائر" },
      { q: "ما اسم أعلى جبل في العالم؟", a: "إيفرست" },
      { q: "ما اسم العملة المصرية؟", a: "الجنيه" },
      { q: "ما اسم أسرع حيوان بري؟", a: "الفهد" },
      { q: "من هو كاتب ألف ليلة وليلة؟", a: "مجموعة مؤلفين" }
    ];

    const qData = questions[Math.floor(Math.random() * questions.length)];

    await sock.sendMessage(chatId, {
      text: `🌍 *سؤال ثقافة عامة:*\n\n${qData.q}\n\n⏳ لديك 30 ثانية للإجابة!
𝒀𝑼𝑴𝑰𝑳𝑨 ⊰𝑩𝑶𝑻 ❄`
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
𝑬𝑺𝑪𝑨𝑵𝑶𝑹⊰𝑩𝑶𝑻 🌋`,
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
𝒀𝑼𝑴𝑰𝑳𝑨 ⊰𝑩𝑶𝑻 ❄` });
    }, 30000);
  }
};