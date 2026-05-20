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

// أسئلة أنمي
const animeQuestions = [
  { question: "❓ من هو قائد قراصنة قبعة القش؟", answer: "لوفي" },
  { question: "❓ ما اسم القطة في أنمي Sailor Moon؟", answer: "لونا" },
  { question: "❓ من هو والد غوكو؟", answer: "باردوك" },
  { question: "❓ ما اسم الشينيغامي في ديث نوت؟", answer: "ريوك" },
  { question: "❓ كم عدد كرات التنين في دراغون بول؟", answer: "7" },
      { question: "❓ من هو أول مستخدم لمانجيكيو شارينغان؟", answer: "إيتاتشي" },
    { question: "❓ من هو أفضل صديق لـ ناروتو؟", answer: "ساسكي" },
    { question: "❓ ما اسم أخ ليفاي بالتبني في هجوم العمالقة؟", answer: "كين" },
    { question: "❓ من هو مؤسس طوكيو مانجي؟", answer: "ميكي" },
    { question: "❓ من هو قاتل نيي في ون بيس؟", answer: "أكاينو" },
    { question: "❓ ما اسم منظمة القتلة في القناص؟", answer: "العناكب" },
    { question: "❓ من هو معلم غون في القناص؟", answer: "كايتو" },
    { question: "❓ من هو ملك النمل في هنتر x هنتر؟", answer: "ميرويم" },
    { question: "❓ من هو شقيق إدوارد إلريك؟", answer: "ألفونسو" },
    { question: "❓ من هو أمير السايانز؟", answer: "فيجيتا" },
    { question: "❓ من هو تلميذ كاكاشي الأقوى؟", answer: "ناروتو" },
    { question: "❓ ما اسم حبيب ناروتو؟", answer: "هيناتا" },
    { question: "❓ ما اسم القط في فيري تيل؟", answer: "هابي" },
    { question: "❓ ما اسم سيف إيتشيغو؟", answer: "زنغتسو" },
    { question: "❓ ما اسم من يستخدم عين الرينغان؟", answer: "ناغاتو" },
    { question: "❓ من هو الكابتن في أنمي كوروكو؟", answer: "تيتسويا" },
    { question: "❓ ما اسم أخ إيتاتشي؟", answer: "ساسكي" },
    { question: "❓ من هو زعيم منظمة الأكاتسوكي؟", answer: "باين" },
    { question: "❓ من هو أقوى شخصية في أنمي ون بنش مان؟", answer: "سايتاما" },
    { question: "❓ ما اسم أنمي فيه دفتر يقتل الأشخاص؟", answer: "ديث نوت" },
    { question: "❓ من هو قاتل والدي إيرين؟", answer: "زيك" },
    { question: "❓ من هو عم لوفي؟", answer: "غارب" },
    { question: "❓ ما اسم البطل في أنمي طوكيو غول؟", answer: "كانيكي" },
    { question: "❓ ما اسم الفتاة التي تساعد إيرين؟", answer: "ميكاسا" },
    { question: "❓ من هو ملك القراصنة؟", answer: "غول دي روجر" },
    { question: "❓ ما اسم الأنمي الذي فيه سايتاما؟", answer: "ون بنش مان" },
    { question: "❓ من هو صديق غون المفضل؟", answer: "كيلوا" },
    { question: "❓ ما اسم الأنمي الذي فيه تانجيرو؟", answer: "قاتل الشياطين" },
    { question: "❓ من هي أخت تانجيرو؟", answer: "نيزوكو" },
    { question: "❓ من هو أقوى هاشيرا؟", answer: "يوتشييرو" },
    { question: "❓ ما اسم الشيطان الذي يملك سيف في قاتل الشياطين؟", answer: "موزان" },
    { question: "❓ ما اسم أول عملاق ظهر في هجوم العمالقة؟", answer: "العملاق المدرع" },
    { question: "❓ ما اسم أنمي فيه نوتا بوك للقتل؟", answer: "ديث نوت" },
    { question: "❓ من هو قائد فريق فيري تيل؟", answer: "ناتسو" },
    { question: "❓ ما اسم شقيق زورو بالتدريب؟", answer: "كوزابورو" },
    { question: "❓ ما اسم المنظمة التي يقودها دون كيهوتي؟", answer: "الدونكيهوتي" },
    { question: "❓ ما اسم الفتاة التي تستخدم الجليد في فيري تيل؟", answer: "غراي" },
    { question: "❓ من هو صاحب القبضة النارية في ون بيس؟", answer: "آيس" },
    { question: "❓ ما اسم عملاق المطرقة؟", answer: "لارا تايبير" }
];


// إعداد المستويات
const levels = {
  سهل: { time: 20000, reward: 50, penalty: 25 },
  متوسط: { time: 30000, reward: 100, penalty: 50 },
  صعب: { time: 40000, reward: 200, penalty: 100 }
};

module.exports = {
  command: 'انمي',
  description: '🎮 لعبة أنمي: خمن الشخصية من السؤال حسب المستوى\n💡 مثال: .انمي سهل',
  
  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const args = m.args || [];
    const inputLevel = (args[0] || '').trim();
    const validLevels = Object.keys(levels);

    if (!validLevels.includes(inputLevel)) {
      return sock.sendMessage(chatId, {
        text: `❌ اختر مستوى صحيح:\n🟢 سهل\n🟡 متوسط\n🔴 صعب\nمثال: *.انمي سهل*`,
        mentions: [sender]
      });
    }

    const levelData = levels[inputLevel];
    const random = animeQuestions[Math.floor(Math.random() * animeQuestions.length)];
    const correctAnswer = random.answer.trim().toLowerCase();

    // إرسال السؤال
    await sock.sendMessage(chatId, {
      text: `
•⪼ ⸽ فــعــالـية 🕸️˹ سؤال أنمي
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*˼🕸️˹⥃السؤال:* ${random.question}
*˼🕸️˹⥃المستوى:* ${inputLevel}
*˼🕸️˹⥃الوقت:* ${levelData.time / 1000} ثانية
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع إدارة المملكة╎⸙ 〙*
*『𝐒.𝐋.𝐕⊰❄⊱سيلفر』*
𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻 ❄`
    });

    let ranks = loadRanks();
    let winnerFound = false;

    const handler = async ({ messages }) => {
      if (winnerFound) return;
      for (const msg of messages) {
        if (msg.key.remoteJid !== chatId) continue;

        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

        if (text.trim().toLowerCase() === correctAnswer) {
          clearTimeout(timeout);
          sock.ev.off('messages.upsert', handler);

          winnerFound = true;
          ranks[sender] = (ranks[sender] || 0) + levelData.reward;
          saveRanks(ranks);

          await sock.sendMessage(chatId, {
            text: `
•⪼ ⸽ فــعــالـية 🕸️˹ سوأل أنمي
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*˼🕸️˹⥃الـشـخـصـيـة:* ${random.answer}
*˼🕸️˹⥃الـفـائـز:* @${sender.split('@')[0]}
*˼🕸️˹⥃نـقـاطـه:* ${ranks[sender]} (+${levelData.reward})
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع إدارة المملكة╎⸙ 〙*
*『𝐒.𝐋.𝐕⊰❄⊱سيلفر』*
𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻 ❄`,
            mentions: [sender]
          });

          break;
        }
      }
    };

    sock.ev.on('messages.upsert', handler);

    // انتهاء الوقت أو عدم وجود إجابة صحيحة
    const timeout = setTimeout(() => {
      if (!winnerFound) {
        sock.ev.off('messages.upsert', handler);
        ranks[sender] = (ranks[sender] || 0) - levelData.penalty;
        saveRanks(ranks);

        sock.sendMessage(chatId, {
          text: `
•⪼ ⸽ فــعــالـية 🕸️˹ سؤال أنمي
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
⌛ انتهى الوقت!
*˼🕸️˹⥃الـشـخـصـيـة:* ${random.answer}
*˼🕸️˹⥃نـقـاطـك بعد الخصم:* ${ranks[sender]} (-${levelData.penalty})
*✵ ⋅• ┉━ ━⌯﹝🕸️﹞⌯━ ━┉ •⋅ ✵*
*〘 توقيع إدارة المملكة╎⸙ 〙*
*『𝐒.𝐋.𝐕⊰❄⊱سيلفر』*
𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻 ❄`
        });
      }
    }, levelData.time);
  }
};