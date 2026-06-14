const riddles = [
  { question: 'أنا شيء إذا لمسته صرخ، ما أنا؟', answer: 'الجرس' },
  { question: 'شيء يمشي بلا أرجل ولا يدخل إلا بالأذن، ما هو؟', answer: 'الصوت' },
  { question: 'له أوراق وما هو بنبات، له جلد وما هو بحيوان، ما هو؟', answer: 'الكتاب' },
  { question: 'أخضر في الأرض وأسود في السوق وأحمر في البيت، ما هو؟', answer: 'الشاي' },
  { question: 'ما هو الشيء الذي كلما أخذت منه كبر؟', answer: 'الحفرة' },
  { question: 'شيء تملكه ويستخدمه الآخرون أكثر منك، ما هو؟', answer: 'اسمك' },
  { question: 'له أسنان ولا يعض، ما هو؟', answer: 'المشط' },
  { question: 'ما هو الشيء الذي يرى كل شيء وليس له عيون؟', answer: 'المرآة' },
  { question: 'شيء كلما كثر لدينا غلا وكلما قل رخص، ما هو؟', answer: 'العقل' }
];

// كائن لحفظ اللغز الحالي لكل شات بشكل منفصل لمنع تداخل الجروبات
if (!global.activeRiddles) global.activeRiddles = {};

module.exports = {
  command: 'تخمين', // اسم الأمر المعتمد
  description: '🎮 لعبة الألغاز والتخمين الذكية',
  category: 'ألعاب',

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    // جلب نص الرسالة المرسلة
    const text = (msg.message?.extendedTextMessage?.text || msg.message?.conversation || '').trim();

    // 1. إذا كتب المستخدم أمر تشغيل اللعبة
    if (text.startsWith(msg.prefix + 'تخمين')) {
      // اختيار لغز عشوائي وحفظه لهذا الجروب تحديداً
      const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
      global.activeRiddles[from] = randomRiddle.answer;

      const questionMessage = `🧠 *إليك اللغز التالي، خمن الإجابة:*\n\n` +
                              `📝 « ${randomRiddle.question} »\n\n` +
                              `💡 أرسل الإجابة مباشرة بدون نقاط!`;

      return await sock.sendMessage(from, { text: questionMessage }, { quoted: msg });
    }

    // 2. فحص الإجابات التلقائية إذا كان هناك لغز نشط في هذا الجروب
    if (global.activeRiddles[from] && text) {
      const correctAnswer = global.activeRiddles[from];

      // التحقق من صحة الإجابة (حذف المسافات الزائدة)
      if (text === correctAnswer) {
        await sock.sendMessage(from, { text: '🎉 كفووو! إجابة صحيحة وممتازة دمرت اللغز 🏆' }, { quoted: msg });
        // إنهاء اللغز الحالي للجروب لإتاحة بدء لغز جديد
        delete global.activeRiddles[from];
      }
    }
  }
};
