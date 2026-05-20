const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { isElite, extractPureNumber } = require("../haykala/elite");

module.exports = {
  command: "تست",
  category: "tools",
  description: "🧪 أمر تجريبي لإرسال أو تحديث ملاحظة الفيديو (خاص بالنخبة فقط).",

  async execute(sock, msg) {
    try {
      const groupJid = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.participant || groupJid;
      const senderNumber = extractPureNumber(senderJid);

      // 🧠 تحقق من النخبة
      if (!isElite(senderNumber)) {
        return sock.sendMessage(groupJid, {
          text: "🚫 هذا الأمر مخصص للنخبة فقط.",
        }, { quoted: msg });
      }

      const mediaDir = path.join(process.cwd(), "media");
      const videoPath = path.join(mediaDir, "elite_note.mp4"); // ✅ اسم جديد للفيديو
      if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

      // لو فيه فيديو مقتبس يتم تحديثه
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (quoted && quoted.videoMessage) {
        const stream = await downloadContentFromMessage(quoted.videoMessage, "video");
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        fs.writeFileSync(videoPath, buffer);

        return sock.sendMessage(groupJid, {
          text: "✅ تم تحديث ملاحظة الفيديو بنجاح!",
        }, { quoted: msg });
      }

      // لو ما فيه فيديو محفوظ مسبقاً، ممكن نحمل من رابط (لو متوفر)
      if (!fs.existsSync(videoPath)) {
        const videoUrl = ""; // ضع رابط افتراضي هنا لو حابب
        if (videoUrl) {
          try {
            const res = await axios.get(videoUrl, { responseType: "arraybuffer", timeout: 20000 });
            if (res.status === 200 && res.data) {
              fs.writeFileSync(videoPath, Buffer.from(res.data));
            }
          } catch (e) {
            return sock.sendMessage(groupJid, {
              text: `⚠️ فشل تحميل الفيديو:\n${e.message}`,
            }, { quoted: msg });
          }
        } else {
          return sock.sendMessage(groupJid, {
            text: "⚠️ لا يوجد فيديو محفوظ أو رابط لتحميله.",
          }, { quoted: msg });
        }
      }

      const videoBuffer = fs.readFileSync(videoPath);

      // سحب أعضاء المجموعة للمنشن
      const groupMetadata = await sock.groupMetadata(groupJid);
      const participants = groupMetadata.participants.map(p => p.id);

      // نص منشن مخفي (حرف غير مرئي)
      const invisibleChar = "\u200B"; 
      const hiddenMentionCaption = `${invisibleChar}`;

      const fakeQuote = {
        key: {
          fromMe: false,
          participant: "0@s.whatsapp.net",
          remoteJid: groupJid,
        },
        message: {
          videoMessage: {
            title: "𝑾•𝑳🍷",
            seconds: "99999",
            gifPlayback: true,
            caption: "Elite 🩸",
            jpegThumbnail: Buffer.alloc(0),
          },
        },
      };

      // إرسال الفيديو + منشن مخفي
      await sock.sendMessage(
        groupJid,
        {
          video: videoBuffer,
          fileName: "elite_note.mp4", // ✅ اسم جديد للفيديو
          mimetype: "video/mp4",
          ptv: true,
          caption: hiddenMentionCaption,
          mentions: participants  // 🔥 منشن فعلي لكن غير ظاهر
        },
        { quoted: fakeQuote }
      );

    } catch (err) {
      await sock.sendMessage(groupJid, {
        text: `❌ حدث خطأ:\n${err.message || err.toString()}`,
      }, { quoted: msg });
    }
  },
};