const fs = require('fs');
const path = require('path');

module.exports = {
  command: ['عشوائي'],
  description: 'يعرض نكتة عشوائية مضحكة',
  category: 'تسلية',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;

      const jokes = [
        '😂 مرة واحد حب يكسر الروتين... كسره وما عرف يرجعه.',
        '😂 واحد دخل مطعم قال للويتر: عندكوا فراخ بتتكلم؟ قاله: لأ، قاله: طب هاتلي وحده ساكته.',
        '😂 مرة واحد جاب العيد قبل العيد... قالهم يمدي أرجعه؟',
        '😂 واحد إشترى شاحن، راح يشحنه.',
        '😂 واحد راح للدكتور، قاله: كل ما أشرب شاي أحس بألم بعيني. الدكتور قاله: شيل الملعقة أول.',
        '😂 فيه واحد راح يشتري نظارة، قاله البائع: نظر ولا شمس؟ قاله: لا غيوم.',
        '😂 مرة واحد أكل سندويشة، انسدح يقول الله يرحمه كان طيب.',
        '😂 واحد غبي شاف إشاره مكتوب عليها "خطر ممنوع الاقتراب"، راح قعد جنبها وصار يصيح: تعالوا بسرعة الخطر طايح!',
        '😂 مدرس رياضيات خلف ولد سماه: +محمد.',
        '😂 غبي راح محل نظارات، سأله البائع: عايز نظارات؟ قاله: لا عايز سمعات.',
        '😂 اثنين يقولون نكت، واحد مات... من الضحك.',
        '😂 واحد قال لصاحبه: تخيّل لو الدنيا بدون بنات؟ قاله: والله ما فيه شاحن، ولا حلاوة، ولا ترتيب، ولا لوفي 😂',
        '😂 فيه واحد كتب على قبره: لا تضحك! يمكن تجي وراي.',
        '😂 ولد سأل أبوه: ليه الكمبيوتر ما يتزوج؟ قاله: لأنه فيه مشاكل تعارض.'
      ];

      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

      const boxedJoke = `
╭── • 😂 نكتة عشوائية • ──╮
│
│ ${randomJoke}
│
╰────────────────────╯`;

      const imagePath = path.join(__dirname, '../media/blue.jpg');
      const imageBuffer = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

      await sock.sendMessage(chatId, {
        text: boxedJoke,
        contextInfo: {
          externalAdReply: {
            title: "😂 نكتة اليوم",
            body: "ضحكة عميقة مع نكتة عشوائية",
            thumbnail: imageBuffer,
            mediaType: 1,
            sourceUrl: "https://t.me/FOX143",
            renderLargerThumbnail: false,
            showAdAttribution: true
          }
        }
      });

    } catch (error) {
      console.error('Error in random joke command:', error);
      if (msg.key?.remoteJid) {
        await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ حدث خطأ أثناء تنفيذ الأمر، حاول مرة أخرى لاحقاً.'
        }, { quoted: msg });
      }
    }
  }
};