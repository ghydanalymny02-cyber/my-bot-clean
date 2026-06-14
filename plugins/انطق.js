const fs = require("fs");
const axios = require("axios");

module.exports = {
  command: "انطق",
  description: "يجعل البوت ينطق النص بصوت بنت عربية.",
  usage: ".انطق مرحباً بك",
  category: "عام",

  async execute(sock, msg, args = []) {
    try {
      // قراءة النص من الرسالة بالكامل مثل كود "اضافه"
      const fullText =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        '';

      const parts = fullText.trim().split(/\s+/);
      const content = parts.slice(1).join(' '); // إزالة الكلمة الأولى "انطق"

      if (!content) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: "❌ يرجى إدخال النص الذي تريد أن ينطقه البوت!"
        }, { quoted: msg });
      }

      const filePath = "voice.mp3";
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(content)}&tl=ar&client=tw-ob`;

      const response = await axios({
        method: "GET",
        url: ttsUrl,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        // إرسال التفاعل 🎙️ قبل إرسال الصوت
        await sock.sendMessage(msg.key.remoteJid, {
          react: {
            text: "🎙️",
            key: msg.key
          }
        });

        // صورة مصغرة إن وُجدت
        const imagePath = "image.jpeg";
        const hasImage = fs.existsSync(imagePath);
        const imageBuffer = hasImage ? fs.readFileSync(imagePath) : null;

        await sock.sendMessage(msg.key.remoteJid, {
          audio: fs.readFileSync(filePath),
          mimetype: "audio/mpeg",
          ptt: true,
          contextInfo: {
            externalAdReply: {
              title: "مـــجـــهـــول⚡",
              body: "استمع للنص بصوت عربي أنثوي 🎧",
              thumbnail: imageBuffer,
              mediaType: 1,
              sourceUrl: "https://t.me/FOX143",
              renderLargerThumbnail: false,
              showAdAttribution: true
            }
          }
        }, { quoted: msg });

        fs.unlinkSync(filePath); // حذف الصوت بعد الإرسال
      });

      writer.on("error", () => {
        sock.sendMessage(msg.key.remoteJid, {
          text: "⚠️ حدث خطأ أثناء تحويل النص إلى صوت."
        }, { quoted: msg });
      });

    } catch (err) {
      console.error("❌ Error in انطق:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ حدث خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};