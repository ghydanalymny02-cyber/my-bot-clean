const fs = require('fs');
const path = require('path');

// إعدادات اللعبة
const gameSettings = {
  timeout: 10000, // 10 ثواني
  points: 200, // النقاط اللي ياخدها الفائز
  dataFile: path.join(__dirname, '..', 'data', 'تاريخ.json')
};

// بنك نقاط مؤقت داخل الذاكرة
const userPoints = {};

module.exports = {
  command: ['تاريخي'],
  description: '📜 سؤال وجواب تاريخي عشوائي مع نقاط',
  category: 'ترفيه',
  async execute(sock, msg) {
    sock.tarikhi = sock.tarikhi || {};
    const chatId = msg.key.remoteJid;
    const senderId = msg.key.participant || msg.key.remoteJid;

    if (chatId in sock.tarikhi) {
      await sock.sendMessage(chatId, {
        text: '⚠️ فيه سؤال شغال بالفعل.. استنى لما يخلص!',
      }, { quoted: sock.tarikhi[chatId].message });
      return;
    }

    try {
      const tari5Data = JSON.parse(fs.readFileSync(gameSettings.dataFile));
      const randomQuestion = tari5Data[Math.floor(Math.random() * tari5Data.length)];

      const questionMessage = `
❓ *سؤالك هو*:
${randomQuestion.question}

👤 *اللاعب*: @${senderId.split('@')[0]}
⏳ *الوقت*: ${(gameSettings.timeout / 1000)} ثانية
🏆 *الجائزة*: ${gameSettings.points} نقطة

✍️ اكتب إجابتك في رسالة
`.trim();

      const sentMsg = await sock.sendMessage(chatId, {
        text: questionMessage,
        mentions: [senderId],
      }, { quoted: msg });

      // حفظ اللعبة النشطة
      sock.tarikhi[chatId] = {
        question: randomQuestion,
        sender: senderId,
        message: sentMsg,
        timeout: setTimeout(async () => {
          if (sock.tarikhi[chatId]) {
            await sock.sendMessage(chatId, {
              text: `⌛ انتهى الوقت!\n\n✅ الإجابة الصحيحة كانت: ${randomQuestion.response}`,
            }, { quoted: sock.tarikhi[chatId].message });
            delete sock.tarikhi[chatId];
          }
        }, gameSettings.timeout)
      };

      // متابعة الرسائل
      sock.ev.on('messages.upsert', async ({ messages }) => {
        const incomingMsg = messages[0];
        const fromChat = incomingMsg.key.remoteJid;
        const text = incomingMsg.message?.conversation?.trim();

        if (!text || !(fromChat in sock.tarikhi)) return;

        const game = sock.tarikhi[fromChat];

        // التحقق من صحة الإجابة
        if (text.toLowerCase() === game.question.response.toLowerCase()) {
          clearTimeout(game.timeout);

          userPoints[incomingMsg.key.participant] = (userPoints[incomingMsg.key.participant] || 0) + gameSettings.points;

          await sock.sendMessage(fromChat, {
            text: `🎉 مبروك يا @${incomingMsg.key.participant.split('@')[0]} ✨\nإجابتك صحيحة ✅\n\n🏆 كسبت ${gameSettings.points} نقطة!`,
            mentions: [incomingMsg.key.participant],
          }, { quoted: incomingMsg });

          delete sock.tarikhi[fromChat];
        }
      });

    } catch (error) {
      console.error('❌ خطأ في لعبة تاريخي:', error);
      await sock.sendMessage(chatId, {
        text: '⚠️ حصل خطأ في تحميل الأسئلة!',
      }, { quoted: msg });
    }
  }
};