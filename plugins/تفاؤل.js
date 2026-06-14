module.exports = {
  category: 'tools',
  command: 'تفاؤل',
  description: 'رسائل إيجابية وتفاؤلية',
  async execute(sock, msg) {
    const optimisticMessages = [
      "🌈 بعد كل عاصفة تشرق الشمس، وبعد كل ليل يأتي النهار",
      "⭐ النجوم لا يمكن رؤيتها إلا في الظلام، والصعوبات تظهر قوتنا",
      "🌱 كل بذرة صغيرة تصبح شجرة كبيرة، وكل بداية صغيرة تقود لنجاح كبير",
      "🚀 اليوم هو أول يوم في بقية حياتك، ابدأه بتفاؤل",
      "🎯 الأهداف الكبيرة تتحقق بخطوات صغيرة مستمرة",
      "💫 أنت أقوى مما تعتقد، وأكثر قدرة مما تتخيل",
      "🌻 كما تشرق الشمس كل صباح، تأتي الفرص الجديدة كل يوم"
    ];
    
    const message = optimisticMessages[Math.floor(Math.random() * optimisticMessages.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `☀️ *رسالة تفاؤل:*\n\n${message}\n\n✨ ابقَ إيجابياً!`
    }, { quoted: msg });
  }
};