const fs = require('fs');
const path = require('path');

// إعدادات اللعبة
const gameSettings = {
  timeout: 10000, // 10 ثواني
  points: 150, // النقاط اللي ياخدها الفائز
  dataFile: path.join(__dirname, '..', 'data', 'عواصم.json') // ملف العواصم
};

// بنك نقاط مؤقت داخل الذاكرة
const userPoints = {};

module.exports = {
  command: ['عواصم'],
  description: '🌍 لعبة عواصم الدول: يطلعلك دولة وانت تجاوب عاصمتها',
  category: 'ترفيه',
  async execute(sock, msg) {
    sock.capitals = sock.capitals || {};
    const chatId = msg.key.remoteJid;
    const senderId = msg.key.participant || msg.key.remoteJid;

    if (chatId in sock.capitals) {
      await sock.sendMessage(chatId, {
        text: '⚠️ فيه لعبة عواصم شغالة دلوقتي.. استنى لحد ما تخلص!',
      }, { quoted: sock.capitals[chatId].message });
      return;
    }

    try {
      const capitalsData = JSON.parse(fs.readFileSync(gameSettings.dataFile));
      const randomQuestion = capitalsData[Math.floor(Math.random() * capitalsData.length)];

      const questionMessage = `
🌍 *الدولة*: ${randomQuestion.question}

👤 *اللاعب*: @${senderId.split('@')[0]}
⏳ *الوقت*: ${(gameSettings.timeout / 1000)} ثانية
🏆 *الجائزة*: ${gameSettings.points} نقطة

✍️ اكتب اسم العاصمة
`.trim();

      const sentMsg = await sock.sendMessage(chatId, {
        text: questionMessage,
        mentions: [senderId],
      }, { quoted: msg });

      // حفظ اللعبة النشطة
      sock.capitals[chatId] = {
        question: randomQuestion,
        sender: senderId,
        message: sentMsg,
        timeout: setTimeout(async () => {
          if (sock.capitals[chatId]) {
            await sock.sendMessage(chatId, {
              text: `⌛ انتهى الوقت!\n\n✅ العاصمة الصحيحة: ${randomQuestion.response}`,
            }, { quoted: sock.capitals[chatId].message });
            delete sock.capitals[chatId];
          }
        }, gameSettings.timeout)
      };

      // متابعة الرسائل
      sock.ev.on('messages.upsert', async ({ messages }) => {
        const incomingMsg = messages[0];
        const fromChat = incomingMsg.key.remoteJid;
        const text = incomingMsg.message?.conversation?.trim();

        if (!text || !(fromChat in sock.capitals)) return;

        const game = sock.capitals[fromChat];

        // التحقق من صحة الإجابة
        if (text.toLowerCase() === game.question.response.toLowerCase()) {
          clearTimeout(game.timeout);

          userPoints[incomingMsg.key.participant] =
            (userPoints[incomingMsg.key.participant] || 0) + gameSettings.points;

          await sock.sendMessage(fromChat, {
            text: `🎉 مبروك يا @${incomingMsg.key.participant.split('@')[0]} ✨\nإجابتك صحيحة ✅\n\n🏆 كسبت ${gameSettings.points} نقطة!`,
            mentions: [incomingMsg.key.participant],
          }, { quoted: incomingMsg });

          delete sock.capitals[fromChat];
        }
      });

    } catch (error) {
      console.error('❌ خطأ في لعبة عواصم:', error);
      await sock.sendMessage(chatId, {
        text: '⚠️ حصل خطأ في تحميل الأسئلة!',
      }, { quoted: msg });
    }
  }
};