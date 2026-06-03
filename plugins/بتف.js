const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { isElite, extractPureNumber } = require("../haykala/elite");

module.exports = {
  command: "ptf",
  category: "tools",
  description: "📹 إرسال فيديو عادي كرد على أي ملاحظة فيديو (خاص بالنخبة فقط).",

  async execute(sock, msg) {
    try {
      const groupJid = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.participant || groupJid;
      const senderNumber = extractPureNumber(senderJid);

      // التحقق من النخبة
      if (!isElite(senderNumber)) {
        return sock.sendMessage(groupJid, {
          text: "🚫 هذا الأمر مخصص للنخبة فقط.",
        }, { quoted: msg });
      }

      const mediaDir = path.join(process.cwd(), "media");
      const videoPath = path.join(mediaDir, "videonote.mp4");
      if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (quoted && quoted.videoMessage) {
        const stream = await downloadContentFromMessage(quoted.videoMessage, "video");
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        fs.writeFileSync(videoPath, buffer);

        return sock.sendMessage(groupJid, {
          text: "✅ تم تحميل الفيديو بنجاح! جاهز للإرسال كفيديو عادي.",
        }, { quoted: msg });
      }

      if (!fs.existsSync(videoPath)) {
        return sock.sendMessage(groupJid, {
          text: "⚠️ لا يوجد فيديو محفوظ مسبقًا للارسال.",
        }, { quoted: msg });
      }

      const videoBuffer = fs.readFileSync(videoPath);

      // إرسال الفيديو كفيديو عادي
      await sock.sendMessage(
        groupJid,
        {
          video: videoBuffer,
          fileName: "video.mp4",
          mimetype: "video/mp4",
          caption: "🎬 فيديو عادي",
        },
        { quoted: msg }
      );

    } catch (err) {
      await sock.sendMessage(groupJid, {
        text: `❌ حدث خطأ أثناء معالجة الفيديو:\n${err.message || err.toString()}`,
      }, { quoted: msg });
    }
  },
};