
const riddles = [
  { question: 'أنا شيء إذا لمسته صرخ، ما أنا؟', answer: 'الجرس' },
  { question: 'شيء يمشي بلا أرجل ولا يدخل إلا بالأذن، ما هو؟', answer: 'الصوت' },
  { question: 'له أوراق وما هو بنبات، له جلد وما هو بحيوان، ما هو؟', answer: 'الكتاب' },
  { question: 'أخضر في الأرض وأسود في السوق وأحمر في البيت، ما هو؟', answer: 'الشاي' },
  { question: 'ما هو الشيء الذي كلما أخذت منه كبر؟', answer: 'الحفرة' },
  { question: 'شيء تملكه ويستخدمه الآخرون أكثر منك، ما هو؟', answer: 'اسمك' },
  { question: 'له أسنان ولا يعض، ما هو؟', answer: 'المشط' },
  { question: 'ما هو الشيء الذي يرى كل شيء وليس له عيون؟', answer: 'المرآة' },
  { question: 'ما هو الشيء الذي إذا أخذت منه زاد؟', answer: 'الحفرة' },
  { question: 'شيء كلما كثر لدينا غلا وكلما قل رخص، ما هو؟', answer: 'العقل' }
];

let currentRiddle = null;

client.on('message', async msg => {
  if (msg.body === '.تخمينن') {
    currentRiddle = riddles[Math.floor(Math.random() * riddles.length)];
    await client.sendMessage(msg.from, currentRiddle.question);
  } else if (currentRiddle && msg.body) {
    if (msg.body.trim() === currentRiddle.answer) {
      await client.sendMessage(msg.from, '🎉 إجابة صحيحة!');
      currentRiddle = null;
    } else {
      await client.sendMessage(msg.from, '❌ خطأ! حاول مرة ثانية.');
    }
  }
});