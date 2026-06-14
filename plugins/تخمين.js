const fs = require('fs');
const path = require('path');

const gameSettings = {
  points: 100,           // نقاط الفوز
  timeout: 40000,        // 40 ثانية
};

const guessGames = {}; // لتخزين اللعبة النشطة لكل شات

module.exports = {
  command: ['تخمين'],
  description: 'لعبة تخمين رقم من 1 إلى 10 مع انتهاء اللعبة عند الفوز أو بعد 40 ثانية',
  category: 'العاب',

  async execute(sock, msg, args) {
    const chatId = msg.key.remoteJid;

    if (guessGames[chatId]) {
      return sock.sendMessage(chatId, {
        text: '❗ هناك لعبة تخمين نشطة بالفعل في هذا الشات!',
      }, { quoted: msg });
    }

    // اختيار رقم عشوائي من 1 إلى 10
    const chosenNumber = Math.floor(Math.random() * 10) + 1;

    // إنشاء اللعبة
    guessGames[chatId] = {
      number: chosenNumber,
      messageId: null,
      attempts: {},   // {playerId: guess} لتخزين محاولة كل لاعب
      timer: null,
    };

    // رسالة البداية
    const startMsg = await sock.sendMessage(chatId, {
      text: `🎲 تم اختيار رقم عشوائي من 1 إلى 10.\nجربوا أنتم تخمنونه! كل لاعب له محاولة واحدة فقط.\n⏳ لديك 40 ثانية.`,
    }, { quoted: msg });

    guessGames[chatId].messageId = startMsg.key.id;

    const game = guessGames[chatId];

    // إعداد مؤقت نهاية اللعبة
    game.timer = setTimeout(async () => {
      delete guessGames[chatId];
      await sock.sendMessage(chatId, {
        text: `⏰ انتهى الوقت! الرقم الصحيح كان: ${chosenNumber}`,
      });
    }, gameSettings.timeout);

    // الاستماع للرسائل الجديدة
    const listener = async ({ messages }) => {
      const m = messages[0];
      const fromChat = m.key.remoteJid;
      const player = m.key.participant || m.key.remoteJid;
      const text = m.message?.conversation?.trim();

      if (!text || !guessGames[fromChat]) return;

      const game = guessGames[fromChat];

      // التحقق من الرقم
      const guess = parseInt(text);
      if (isNaN(guess) || guess < 1 || guess > 10) return;

      // تحقق إذا اللاعب حاول مسبقًا
      if (game.attempts[player]) {
        return sock.sendMessage(fromChat, {
          text: `⚠️ @${player.split('@')[0]} لقد استخدمت محاولتك بالفعل!`,
          mentions: [player],
        });
      }

      // تسجيل محاولة اللاعب
      game.attempts[player] = guess;

      // التحقق من الفوز
      if (guess === game.number) {
        clearTimeout(game.timer); // إيقاف المؤقت
        delete guessGames[fromChat]; // انتهاء اللعبة فورًا عند الفوز

        // تحديث النقاط
        const pointsPath = path.join(__dirname, '..', 'data', 'userPoints.json');
        if (!fs.existsSync(pointsPath)) fs.writeFileSync(pointsPath, '{}');
        let userPoints = JSON.parse(fs.readFileSync(pointsPath));
        userPoints[player] = (userPoints[player] || 0) + gameSettings.points;
        fs.writeFileSync(pointsPath, JSON.stringify(userPoints, null, 2));

        await sock.sendMessage(fromChat, {
          text: `🎉 فاز @${player.split('@')[0]}! ✅\nلقد خمّنت الرقم الصحيح: ${guess}\n🏆 حصلت على ${gameSettings.points} نقطة.\n⏰ انتهت اللعبة.`,
          mentions: [player],
        });

      } else {
        await sock.sendMessage(fromChat, {
          text: `❌ @${player.split('@')[0]} حاولت ${guess} وهو ليس الرقم الصحيح!`,
          mentions: [player],
        });
      }
    };

    sock.ev.on('messages.upsert', listener);
  }
};