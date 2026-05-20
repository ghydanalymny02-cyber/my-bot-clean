const { isElite } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
  command: "النوم",
  description: "😴 إيقاف تشغيل البوت بعد عدد معين من الوقت (دقايق أو ثواني) [خاص بالنخبة فقط].",
  category: 'DEVELOPER',
  usage: ".النوم [عدد][m/s] (مثال: .النوم 5m أو .النوم 30s)",

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;
      const sender = decode(msg.key.participant || chatId);
      const senderLid = sender.split('@')[0];

      if (!(await isElite(senderLid))) {
        return await sock.sendMessage(chatId, {
          text: "🚫 هذا الأمر مخصص للنخبة فقط!"
        }, { quoted: msg });
      }

      // قراءة النص اللي بعد .النوم
      const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || "";
      const input = body.replace(".النوم", "").trim().toLowerCase();

      if (!input) {
        return await sock.sendMessage(chatId, {
          text: "⚠️ من فضلك أدخل وقت صحيح.\nمثال: `.النوم 5m` أو `.النوم 30s`"
        }, { quoted: msg });
      }

      let timeMs;
      let displayTime;

      if (input.endsWith("s")) {
        const seconds = parseInt(input.slice(0, -1));
        if (isNaN(seconds) || seconds <= 0) {
          return await sock.sendMessage(chatId, { text: "⚠️ عدد الثواني غير صحيح." }, { quoted: msg });
        }
        timeMs = seconds * 1000;
        displayTime = `${seconds} ثانية${seconds > 1 ? '' : ''}`;
      } else if (input.endsWith("m")) {
        const minutes = parseInt(input.slice(0, -1));
        if (isNaN(minutes) || minutes <= 0) {
          return await sock.sendMessage(chatId, { text: "⚠️ عدد الدقايق غير صحيح." }, { quoted: msg });
        }
        timeMs = minutes * 60 * 1000;
        displayTime = `${minutes} دقيقة${minutes > 1 ? '' : ''}`;
      } else {
        // الافتراضي = دقايق
        const minutes = parseInt(input);
        if (isNaN(minutes) || minutes <= 0) {
          return await sock.sendMessage(chatId, { text: "⚠️ عدد الدقايق غير صحيح." }, { quoted: msg });
        }
        timeMs = minutes * 60 * 1000;
        displayTime = `${minutes} دقيقة${minutes > 1 ? '' : ''}`;
      }

      // أول رسالة
      const countdownMsg = await sock.sendMessage(chatId, {
        text: `😴 البوت هينام بعد ${displayTime}...`
      }, { quoted: msg });

      // تايمر
      setTimeout(async () => {
        try {
          // تعديل الرسالة الأولى
          await sock.sendMessage(chatId, {
            edit: countdownMsg.key,
            text: `✅ انتهى الوقت (${displayTime})!`
          });
        } catch (e) {}

        // رسالة أخيرة + قفل البوت
        await sock.sendMessage(chatId, {
          text: "⛔ تم إيقاف تشغيل البوت الآن..."
        }).catch(() => {});

        process.exit(0);
      }, timeMs);

    } catch (error) {
      console.error("✗ خطأ في أمر النوم:", error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${error.message || error.toString()}`
      }, { quoted: msg });
    }
  }
};