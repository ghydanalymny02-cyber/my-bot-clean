module.exports = {
  category: 'tools',
  command: 'تأمل',
  description: 'جلسة تأمل',
  async execute(sock, msg) {
    const meditations = [
      "🌿 اجلس بوضعية مريحة، خذ نفساً عميقاً، وأطلق التوتر مع الزفير...",
      "🍃 استمع إلى صوت الطبيعة من حولك، حتى لو كان في مخيلتك...",
      "💧 تخيل نفسك كالماء، تتدفق بهدوء وتتأقلم مع كل شيء...",
      "🌅 تصور شروق الشمس داخل قلبك، ينير كل ظلام...",
      "🌸 اشعر بالامتنان لثلاثة أشياء في حياتك الآن..."
    ];
    const randomMeditation = meditations[Math.floor(Math.random() * meditations.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🧘 *جلسة تأمل قصيرة:*\n\n${randomMeditation}\n\n⏳ خذ 5 دقائق لنفسك...`
    }, { quoted: msg });
  }
};