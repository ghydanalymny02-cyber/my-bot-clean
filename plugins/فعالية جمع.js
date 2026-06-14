const fs = require('fs');
const path = require('path');

// إعدادات اللعبة
const gameSettings = {
  timeout: 15000, // 15 ثانية
  points: 150, // النقاط اللي ياخدها الفائز
  dataFile: path.join(__dirname, '..', 'data', 'جمع.json') // هنا ملف فكك.json
};

// بنك نقاط مؤقت داخل الذاكرة
const userPoints = {};

module.exports = {
  command: ['جمع'],
  description: '🔡 لعبة جمع الكلمة مع نقاط',
  category: 'ترفيه',
  async execute(sock, msg) {
    sock.fokk = sock.fokk || {};
    const chatId = msg.key.remoteJid;
    const senderId = msg.key.participant || msg.key.remoteJid;

    if (chatId in sock.fokk) {
      await sock.sendMessage(chatId, {
        text: '⚠️ فيه لعبة شغالة بالفعل.. استنى لما تخلص!',
      }, { quoted: sock.fokk[chatId].message });
      return;
    }

    try {
      const fokkData = JSON.parse(fs.readFileSync(gameSettings.dataFile));
      const randomQuestion = fokkData[Math.floor(Math.random() * fokkData.length)];

      const questionMessage = `
🔡 *جمع الكلمة دي*:
${randomQuestion.question}

👤 *اللاعب*: @${senderId.split('@')[0]}
⏳ *الوقت*: ${(gameSettings.timeout / 1000)} ثانية
🏆 *الجائزة*: ${gameSettings.points} نقطة

✍️ اكتب الإجابة بالتجميع الصحيح
مـــجـــهـــول ⊰𝑩𝑶𝑻 ❄`.trim();

      const sentMsg = await sock.sendMessage(chatId, {
        text: questionMessage,
        mentions: [senderId],
      }, { quoted: msg });

      // حفظ اللعبة النشطة
      sock.fokk[chatId] = {
        question: randomQuestion,
        sender: senderId,
        message: sentMsg,
        timeout: setTimeout(async () => {
          if (sock.fokk[chatId]) {
            await sock.sendMessage(chatId, {
              text: `⌛ انتهى الوقت!\n\n✅ الإجابة الصحيحة كانت: ${randomQuestion.response}`,
            }, { quoted: sock.fokk[chatId].message });
            delete sock.fokk[chatId];
          }
        }, gameSettings.timeout)
      };

      // متابعة الرسائل
      sock.ev.on('messages.upsert', async ({ messages }) => {
        const incomingMsg = messages[0];
        const fromChat = incomingMsg.key.remoteJid;
        const text = incomingMsg.message?.conversation?.trim();

        if (!text || !(fromChat in sock.fokk)) return;

        const game = sock.fokk[fromChat];

        // التحقق من صحة الإجابة
        if (text.toLowerCase() === game.question.response.toLowerCase()) {
          clearTimeout(game.timeout);

          userPoints[incomingMsg.key.participant] =
            (userPoints[incomingMsg.key.participant] || 0) + gameSettings.points;

          await sock.sendMessage(fromChat, {
            text: `🎉 مبروك يا @${incomingMsg.key.participant.split('@')[0]} ✨\nإجابتك صحيحة ✅\n\n🏆 كسبت ${gameSettings.points} نقطة!`,
            mentions: [incomingMsg.key.participant],
          }, { quoted: incomingMsg });

          delete sock.fokk[fromChat];
        }
      });

    } catch (error) {
      console.error('❌ خطأ في لعبة فكك:', error);
      await sock.sendMessage(chatId, {
        text: '⚠️ حصل خطأ في تحميل البيانات!',
      }, { quoted: msg });
    }
  }
};