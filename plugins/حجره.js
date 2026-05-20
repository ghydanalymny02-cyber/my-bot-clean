const fs = require('fs');
const path = require('path');

// تحميل نقاط اللاعبين
const pointsFile = path.join(__dirname, '../data/ranks.json');
let points = {};

if (fs.existsSync(pointsFile)) {
  points = JSON.parse(fs.readFileSync(pointsFile));
}

function savePoints() {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

const choices = ['حجره', 'ورقه', 'مقص'];

module.exports = {
  command: 'حجره',
  category: 'ترفيه',
  description: '🎮 لعبة حجرة ورقة مقص ضد البوت!',

  async execute(sock, msg, args) {
    try {
      const chatId = msg.key.remoteJid;

      if (!chatId.endsWith('@g.us')) {
        return sock.sendMessage(chatId, { text: '❌ هذا الأمر يعمل فقط في المجموعات.' }, { quoted: msg });
      }

      // التأكد من وجود args
      const text = msg.message.conversation || '';
const userChoice = text.split(' ')[1] ? text.split(' ')[1].trim() : null;

      if (!userChoice || !choices.includes(userChoice)) {
        return sock.sendMessage(chatId, {
          text: `🔰 *اختر واحدة من:* حجره / ورقه / مقص\n\n✍️ مثال: .حجره ورقه`,
        }, { quoted: msg });
      }

      const botChoice = choices[Math.floor(Math.random() * choices.length)];
      const sender = msg.key.participant || chatId;

      let result = '';
      let pointMessage = '';

      if (userChoice === botChoice) {
        result = '🔁 تعادل!';
      } else if (
        (userChoice === 'حجره' && botChoice === 'مقص') ||
        (userChoice === 'ورقه' && botChoice === 'حجره') ||
        (userChoice === 'مقص' && botChoice === 'ورقه')
      ) {
        result = '🎉 فزت!';

        if (!points[sender]) points[sender] = 0;
        points[sender] += 1;
        savePoints();

        pointMessage = `\n🏆 رصيدك الآن: *${points[sender]}* نقطة.`;
      } else {
        result = '😢 خسرت!';
      }

      await sock.sendMessage(chatId, {
        text: `🎮 *لعبة حجرة ورقة مقص*\n\n👤 اختيارك: ${userChoice}\n🤖 اختيار البوت: ${botChoice}\n\n📢 النتيجة: ${result}${pointMessage}`,
      }, { quoted: msg });

    } catch (err) {
      console.error('خطأ في لعبة حجره:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: '⚠ حصل خطأ غير متوقع.' }, { quoted: msg });
    }
  }
};