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
  category: 'ترفيه',
  command: 'تخمين-شخصيه',
  async execute(sock, m) {
    const chatId = m.key.remoteJid;

    const characters = [
      { name: "ناروتو", hint: "نينجا شقي يحب الرامن ويملك وحش الكيوبي بداخله." },
      { name: "ساسكي", hint: "من عشيرة الأوتشيها، يسعى للانتقام ويملك الشارينغان." },
      { name: "ساكورا", hint: "الفتاة الوحيدة في الفريق السابع، لديها قوة خارقة بعد تدريب تسونادي." },
      { name: "كاكاشي", hint: "النينجا المنسوخ، يملك شارينغان في عين واحدة ويغطي وجهه دائمًا." },
      { name: "إيتاتشي", hint: "قتل عشيرته من أجل السلام، وهو الأخ الأكبر لساسكي." },
      { name: "ليفاي", hint: "قصير، هادئ، وأقوى جندي بشري ضد العمالقة." },
      { name: "إيرين", hint: "صاحب عبارة 'سأقضي على كل العمالقة'، يتحول لعملاق." },
      { name: "ميكاسا", hint: "تحمي إيرين دائمًا، مقاتلة قوية وباردة الأعصاب." },
      { name: "أرمين", hint: "ذكي جدًا، صديق إيرين المقرب، لديه قوة الإقناع." },
      { name: "زورو", hint: "سياف بثلاث سيوف، يريد أن يصبح أقوى سياف في العالم." },
      { name: "لوفي", hint: "قبعة القش، يحلم بأن يصبح ملك القراصنة." },
      { name: "سانجي", hint: "الطباخ الوسيم، يستخدم قدمه في القتال ويحب الفتيات." },
      { name: "نامي", hint: "رسم الخرائط والتحكم في الطقس، تحب المال." },
      { name: "تشوبر", hint: "رنة تتحول لإنسان، طبيب طاقم قبعة القش." },
      { name: "روبين", hint: "تحب الكتب، تستطيع إخراج أيدي من أي مكان." },
      { name: "فرانكي", hint: "آلي ومهندس الطاقم، يحب الصراخ 'سوبّر!'" },
      { name: "سايتاما", hint: "أقوى بطل، يهزم أي شخص بضربة واحدة فقط." },
      { name: "جينوس", hint: "سايبورغ تلميذ سايتاما، يسعى للانتقام." },
      { name: "غوكو", hint: "محارب سايان يحب القتال والطعام، يتحول لسوبر سايان." },
      { name: "فيجيتا", hint: "أمير السايان، فخور جدًا بنفسه." },
      { name: "غوهان", hint: "ابن غوكو، هادئ وقوي عندما يغضب." },
      { name: "كيلوا", hint: "من عائلة قتلة، سريع وذكي ويحب غون." },
      { name: "غون", hint: "صبي يبحث عن والده، يمتلك قلب نقي وقوة مذهلة." },
      { name: "هيسوكا", hint: "غامض ومخيف، يحب القتال والأشخاص الأقوياء." },
      { name: "ناتسو", hint: "ساحر التنين الناري من نقابة فيري تيل، يحب القتال." },
      { name: "لوسي", hint: "مستدعية أرواح، تحب الكتابة، وصديقة ناتسو." },
      { name: "جراي", hint: "ساحر جليد يحب خلع ملابسه، منافس ناتسو." },
      { name: "إيرزا", hint: "ساحرة المدرعات، قوية جدًا ومخيفة عندما تغضب." },
      { name: "تانجيرو", hint: "صياد شياطين طيب، يريد إعادة أخته لطبيعتها." },
      { name: "نيزوكو", hint: "أخته تحولت لشيطان لكنها لا تؤذي البشر." },
      { name: "إينوسكي", hint: "يرتدي رأس خنزير، مقاتل عنيف وسريع." },
      { name: "زينيتسو", hint: "جبان لكنه يصبح قويًا جدًا عندما يغمى عليه." },
      { name: "أوبايتو", hint: "كان صديق كاكاشي، أصبح شريرًا بسبب الخيانة." },
      { name: "مدرا", hint: "من أقوى شخصيات الأوتشيها، يريد السلام بطريقته الخاصة." },
      { name: "بوروتو", hint: "ابن ناروتو، لا يحب المقارنة بوالده." },
      { name: "كونوهمارو", hint: "تلميذ سابق لناروتو، أصبح جونين قوي." },
      { name: "نيجي", hint: "من عشيرة الهيوغا، يملك البياكوغان." },
      { name: "هيناتا", hint: "خجولة، تحب ناروتو، وتقاتل بأسلوب لطيف." },
      { name: "روك لي", hint: "لا يستطيع استخدام الجتسو، لكن يعتمد على التايجتسو فقط." },
      { name: "غارا", hint: "كان شريرًا، يتحكم في الرمل، أصبح كازيكاجي." },
      { name: "شينوبو", hint: "صيادة شياطين، صغيرة الحجم وتستخدم السم." },
      { name: "رونالد", hint: "محقق في عالم الموت، يمتلك مذكرة الموت." },
      { name: "لايت", hint: "يستخدم مذكرة الموت لتطهير العالم من المجرمين." },
      { name: "إل", hint: "محقق عبقري، يحاول كشف كيرا." },
      { name: "ريوك", hint: "شينيغامي يحب التفاح، أعطى المذكرة للايت." }
    ];

    const random = characters[Math.floor(Math.random() * characters.length)];
    const correctAnswer = random.name.trim().toLowerCase();

    await sock.sendMessage(chatId, {
      text: `🧠 خمن الشخصية من هذا الوصف:\n\n${random.hint}\n\n⏳ لديك 30 ثانية فقط!`
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
            text: `✅ صحيح! الشخصية هي *${random.name}*.\n🏆 الفائز: @${sender.split('@')[0]}\n📊 نقاطك: ${ranks[sender]}`,
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
        text: `⌛ انتهى الوقت!\nالإجابة الصحيحة كانت: *${random.name}*`
      });
    }, 30000);
  }
};