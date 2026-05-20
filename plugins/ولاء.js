module.exports = {
  command: 'ولاء',
  description: '🧎‍♂️ نسبة ولاء العضو لسيده',
  usage: '.ولاء @العضو',
  category: 'ترفيه',

  async execute(sock, msg) {
    const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (!mention || mention.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ لازم تمنشن حد علشان أقيس درجة ولاءه.',
      }, { quoted: msg });
    }

    const target = mention[0];
    const userId = target.split('@')[0];
    const loyalty = Math.floor(Math.random() * 101);

    let comment = '';
    if (loyalty >= 90) comment = 'عبد وفيّ من الدرجة الأولى 👑';
    else if (loyalty >= 70) comment = 'ولاءه عالي بس ساعات بيزوغ 😒';
    else if (loyalty >= 40) comment = 'لسانه مع سيده، بس قلبه مشغول 😬';
    else if (loyalty >= 10) comment = 'بياكل مع الأعداء وبيضحك للسيد 👀';
    else comment = 'خان سيده عشان كسرة عيش 🥖💔';

    const message = `🧎‍♂️ *تحليل ولاء*: *@${userId}*\n\n📊 نسبة الولاء: *${loyalty}%*\n🗣️ ${comment}`;

    await sock.sendMessage(msg.key.remoteJid, {
      text: message,
      mentions: [target],
    }, { quoted: msg });
  }
};