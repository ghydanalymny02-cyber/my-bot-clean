const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { isElite, extractPureNumber } = require("../haykala/elite");

module.exports = {
  command: "فخم",
  category: "tools",
  description: "📹 إرسال أو تحديث ملاحظة الفيديو (خاص بالنخبة فقط).",

  async execute(sock, msg) {
    try {
      const groupJid = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.participant || groupJid;
      const senderNumber = extractPureNumber(senderJid);

      // 🧠 التحقق من النخبة
      if (!isElite(senderNumber)) {
        return sock.sendMessage(groupJid, {
          text: "🚫 هذا الأمر مخصص للنخبة فقط.",
        }, { quoted: msg });
      }

      // حقوق ❅𝑂⃝🍷 𝑊𝐼𝐿𝐿𝐼𝐴𝑀⁩
      const mediaDir = path.join(process.cwd(), "media");
      const videoPath = path.join(mediaDir, "videonote.mp4");
      if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

      // قناتي https://whatsapp.com/channel/0029Vb6Jm9nDDmFdUpWn3733
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

      // رقم ❅𝑂⃝🍷 𝑊𝐼𝐿𝐿𝐼𝐴𝑀⁩ +20 10 99800953
      if (!fs.existsSync(videoPath)) {
        const videoUrl = "";
        try {
          const res = await axios.get(videoUrl, { responseType: "arraybuffer", timeout: 20000 });
          if (res.status !== 200 || !res.data) {
            throw new Error(`فشل تحميل الفيديو - حالة: ${res.status}`);
          }
          fs.writeFileSync(videoPath, Buffer.from(res.data));
        } catch (e) {
          return sock.sendMessage(groupJid, {
            text: `⚠️ فشل تحميل الفيديو:\n${e.message}`,
          }, { quoted: msg });
        }
      }

      const videoBuffer = fs.readFileSync(videoPath);

      // +20 10 99800953
      const fakeQuote = {
        key: {
          fromMe: false,
          participant: "0@s.whatsapp.net",
          remoteJid: groupJid,
        },
        message: {
          videoMessage: {
            title: "مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹",
            seconds: "99999",
            gifPlayback: true,
            caption: "❅𝑂⃝❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹",
            jpegThumbnail: Buffer.alloc(0),
          },
        },
      };

      // 🔽 ❅𝑂⃝🍷 𝑊𝐼𝐿𝐿𝐼𝐴𝑀⁩
      await sock.sendMessage(
        groupJid,
        {
          video: videoBuffer,
          fileName: "videonote.mp4",
          mimetype: "video/mp4",
          ptv: true,
          caption: "مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹",
        },
        { quoted: fakeQuote }
      );

    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ أثناء معالجة الفيديو:\n${err.message || err.toString()}`,
      }, { quoted: msg });
    }
  },
};