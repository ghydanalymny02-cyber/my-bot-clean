module.exports = {
  category: 'tools',
  command: 'صبر',
  description: 'كلمات عن الصبر',
  async execute(sock, msg) {
    const patienceMessages = [
      '🌟 الصبر مفتاح الفرج',
      '💎 إن مع العسر يسرا',
      '🕌 اصبر فإن الله مع الصابرين',
      '✨ الصبر عند المصيبة يسمى إيماناً',
      '🌅 بعد الشدة تأتي الرخاء'
    ];
    const randomMessage = patienceMessages[Math.floor(Math.random() * patienceMessages.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🕌 *كلمة عن الصبر:*\n\n${randomMessage}\n\n🌟 {وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ}`
    }, { quoted: msg });
  }
};