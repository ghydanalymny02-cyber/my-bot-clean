module.exports = {
  command: 'حكم',
  category: 'معلومات',
  description: 'يرسل حكمة عشوائية',
  usage: '.حكم',

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    const حكم = [
      'الحكمة ضالة المؤمن، فحيث وجدها فهو أحق بها.',
      'من جدّ وجد، ومن زرع حصد.',
      'الصمت حكمة، وقليل فاعله.',
      'لا تؤجل عمل اليوم إلى الغد.',
      'من راقب الناس مات همًا.',
      'خير الكلام ما قلّ ودلّ.',
      'ازرع خيراً ولو في غير موضعه، فلن يضيع أجر من أحسن عملاً.',
      'النجاح لا يأتيك، بل أنت تذهب إليه.',
      'كثرة التفكير تسرق السعادة.',
      'لا شيء مستحيل، الإرادة تصنع المعجزات.'
    ];

    const random = حكم[Math.floor(Math.random() * حكم.length)];

    await sock.sendMessage(from, { text: `🧠 حكمة اليوم:\n\n❝ ${random} ❞` }, { quoted: msg });
  }
};