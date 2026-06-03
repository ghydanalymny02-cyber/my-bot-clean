module.exports = {
  command: 'حظي',
  description: 'يعطيك حظك اليوم بشكل عشوائي',
  usage: '.حظي',
  category: 'مرح',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const sender = msg.pushName || 'مجهول';

    const fortunes = [
      '🍀 حظك اليوم أسطوري، استعد للمفاجآت!',
      '☠️ للأسف... حظك أسوأ من كورو بالامتحانات.',
      '💘 اليوم هو يوم الحب... انتبه من رسالة غامضة 😉.',
      '🤑 سترزق بمال غير متوقع!',
      '🐸 وقعت في حفرة ض蛙!',
      '🔥 حظك اليوم مليء بالإثارة والمشاكل... انتبه!',
      '👑 ستحصل على احترام الكل، استمتع بيومك يا ملك.',
      '🌧️ يومك غائم... خليك هادئ.',
      '🎉 مفاجأة بانتظارك خلال ساعات!',
      '🧟‍♂️ انتبه... قد يقابلك زومبي اليوم 😱.'
    ];

    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    await sock.sendMessage(chatId, {
      text: `🔮 *${sender}*\n\n${randomFortune}`
    }, { quoted: msg });
  }
};