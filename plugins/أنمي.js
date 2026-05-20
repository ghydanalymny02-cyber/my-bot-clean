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

const animeQuestions = [
  { question: "❓ من هو قائد قراصنة قبعة القش؟", answer: "لوفي" },
  { question: "❓ ما اسم القطة في أنمي Sailor Moon؟", answer: "لونا" },
  { question: "❓ من هو والد غوكو؟", answer: "باردوك" },
  { question: "❓ ما اسم الشينيغامي في ديث نوت؟", answer: "ريوك" },
  { question: "❓ كم عدد كرات التنين في دراغون بول؟", answer: "7" },
  { question: "❓ من هو قائد قراصنة قبعة القش؟", answer: "لوفي" },
  { question: "❓ ما اسم القطة في أنمي Sailor Moon؟", answer: "لونا" },
  { question: "❓ من هو والد غوكو؟", answer: "باردوك" },
  { question: "❓ ما اسم الشينيغامي في ديث نوت؟", answer: "ريوك" },
  { question: "❓ كم عدد كرات التنين في دراغون بول؟", answer: "7" },
  { question: "❓ من هو خصم ناروتو الأساسي؟", answer: "ساسكي" },
  { question: "❓ من الذي كتب أسماء الأشخاص في ديث نوت؟", answer: "لايت" },
  { question: "❓ ما اسم أخ إيتاتشي؟", answer: "ساسكي" },
  { question: "❓ من هو هاوك آيز في ون بيس؟", answer: "ميهوك" },
  { question: "❓ ما اسم الكيان الذي يساعد إينويشا؟", answer: "كيكيو" },
  { question: "❓ ما اسم صديق غون المقرب؟", answer: "كيلوا" },
  { question: "❓ ما اسم التقنية النهائية لناروتو؟", answer: "راسينغان" },
  { question: "❓ ما اسم الأنمي الذي يحتوي على شخصية إدوارد إلريك؟", answer: "فول ميتال ألكيمست" },
  { question: "❓ من هو ملك القراصنة؟", answer: "غول دي روجر" },
  { question: "❓ ما اسم سيف زورو الثالث؟", answer: "وادو إيتشي مونجي" },
  { question: "❓ من هو خصم لوفي في أرخبيل شابوندي؟", answer: "كيزارو" },
  { question: "❓ ما اسم فتاة التي تمتلك قوة تيتان المؤنث؟", answer: "آني" },
  { question: "❓ من هو الذي قتل إيتاتشي؟", answer: "ساسكي" },
  { question: "❓ من هو أعظم محقق في ديث نوت؟", answer: "L" },
  { question: "❓ من هو صاحب قبعة القش قبل لوفي؟", answer: "شانكس" },
  { question: "❓ ما اسم المنظمة التي ينتمي إليها إيتاتشي؟", answer: "الأكاتسكي" },
  { question: "❓ من هو المعلم الخاص بـ غون؟", answer: "كايتو" },
  { question: "❓ من هو ملك العمالقة؟", answer: "زيك" },
  { question: "❓ من هو النينجا الأسطوري الذي درب ناروتو؟", answer: "جيرايا" },
  { question: "❓ ما اسم أول بوكيمون في البوكيدكس؟", answer: "بولباسور" },
  { question: "❓ من هو صاحب قدرة غريموار النجم الأسود؟", answer: "أستا" },
  { question: "❓ من هو قاتل والد إيرين؟", answer: "زيك" },
  { question: "❓ من هو قائد فرقة الاستطلاع في هجوم العمالقة؟", answer: "ليفاي" },
  { question: "❓ ما اسم أخ ناروتو؟", answer: "ما عندوش" },
  { question: "❓ من هو الشخص اللي أكل فاكهة المطاط؟", answer: "لوفي" },
  { question: "❓ ما اسم شخصية ناروتو بالكامل؟", answer: "ناروتو أوزوماكي" },
  { question: "❓ من هو محقق كونان الحقيقي؟", answer: "سينشي كودو" },
  { question: "❓ من هي فتاة القمر في أنمي Sailor Moon؟", answer: "أوساغي" },
  { question: "❓ من هو الخصم الرئيسي لغون؟", answer: "هيسوكا" },
  { question: "❓ من هو قائد فرقة بلاك بولز؟", answer: "يامي" },
  { question: "❓ من هو والد إيرين؟", answer: "غريشا ييغر" },
  { question: "❓ ما اسم صديقة ميليوداس؟", answer: "إليزابيث" },
  { question: "❓ من هو الكابتن في بليتش؟", answer: "إيتشيغو" },
  { question: "❓ ما اسم القط في فيري تيل؟", answer: "هابي" },
  { question: "❓ ما اسم منظمة القتلة في هنتر x هنتر؟", answer: "العناكب" },
  { question: "❓ من هو أعظم ساحر في بلاك كلوفر؟", answer: "الملك السحري" },
  { question: "❓ ما اسم الحيوان اللي مع ناروتو؟", answer: "الكيوبي" },
  { question: "❓ ما اسم العدو اللي عنده قدرة النسخ في ناروتو؟", answer: "كاكاشي" },
  { question: "❓ من هو مؤلف مذكرة الموت؟", answer: "تسوجومي أوبا" },
  { question: "❓ ما اسم المكان الذي يتدرب فيه أبطال Boku no Hero؟", answer: "يو اي" },
  { question: "❓ من هو الذي يملك قدرة “وان فور أول”؟", answer: "ديكو" },
  { question: "❓ من هو قاتل نيزوكو؟", answer: "موزان" },
  { question: "❓ ما اسم القمر الصناعي في أنمي Dr. Stone؟", answer: "Senku" },
  { question: "❓ من هو الذكي في أنمي كونان؟", answer: "سينشي" },
  { question: "❓ ما اسم الأميرة في أنمي توتورو؟", answer: "ماي" },
  { question: "❓ من هو مؤسس أنمي ناروتو؟", answer: "ماساشي كيشيموتو" },
];

module.exports = {
  category: 'ترفيه',
  command: 'أنمي',
  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    const random = animeQuestions[Math.floor(Math.random() * animeQuestions.length)];
    const correctAnswer = random.answer.trim().toLowerCase();

    await sock.sendMessage(chatId, {
      text: `🎌 سؤال أنمي:\n\n${random.question}\n\n⏳ لديك 30 ثانية فقط للإجابة!`
    });

    const handler = async ({ messages }) => {
      for (const msg of messages) {
        if (msg.key.remoteJid !== chatId) continue;

        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          '';

        if (text.trim().toLowerCase() === correctAnswer) {
          clearTimeout(timeout);
          sock.ev.off('messages.upsert', handler);

          const sender = msg.key.participant;
          const ranks = loadRanks();
          ranks[sender] = (ranks[sender] || 0) + 1;
          saveRanks(ranks);

          await sock.sendMessage(chatId, {
            text: `✅ صحيح! الإجابة هي *${random.answer}*.\n🏆 الفائز: @${sender.split('@')[0]}\n📊 نقاطك: ${ranks[sender]}`,
            mentions: [sender]
          });

          break;
        }
      }
    };

    sock.ev.on('messages.upsert', handler);

    const timeout = setTimeout(() => {
      sock.ev.off('messages.upsert', handler);
      sock.sendMessage(chatId, {
        text: `⌛ انتهى الوقت!\nالإجابة الصحيحة كانت: *${random.answer}*`
      });
    }, 30000);
  }
};