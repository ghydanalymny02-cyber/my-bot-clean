const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  command: ['السلام'],
  description: "الرد على السلام",
  usage: ".السلام",
  category: "tools",

  async execute(sock, msg) {
    try {
      let imageBuffer = null;

      try {
        const senderJid = msg.key.participant || msg.key.remoteJid;
        const pfpUrl = await sock.profilePictureUrl(senderJid, "image");
        if (pfpUrl) {
          const res = await axios.get(pfpUrl, { responseType: "arraybuffer" });
          imageBuffer = Buffer.from(res.data, "binary");
        }
      } catch (e) {
        // تجاهل الخطأ لو فشل جلب الصورة
      }

      if (!imageBuffer) {
        const fallbackPath = path.join(process.cwd(), "image.jpeg");
        if (fs.existsSync(fallbackPath)) {
          imageBuffer = fs.readFileSync(fallbackPath);
        }
      }

      const replies = [
        "وَعَلَيْكُمُ ٱلسَّلَامُ وَرَحْمَةُ ٱللّٰهِ وَبَرَكَاتُهُ 🤍🕊️",
        "✦ وَعَــلَيْكُــمْ ٱلسَّلَامْ وَرَحْمَةُ ٱللّٰه وَبَرَكَاتُــه ✨💫",
        "وَعَــلَيْكُــم السَّـلَام ورَحْمَةُ اللهِ وَبَركَاتُه 🌸🤲",
        "وَ؏ـليگم ٱلسَلٱمْ وَرحـمة ٱللـّٰه وبرگاته🌿💚",
        "➸ وَ؏َـلَـيْـكُـمْ ٱلسَّلَامُ وَرَحْمَةُ ٱللّٰهِ وَبَرَكَاتُهُ 💠🕌"
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      await sock.sendMessage(msg.key.remoteJid, {
        text: randomReply,
        contextInfo: {
          externalAdReply: {
            title: "رد السلام 🤍",
            body: "تم الرد على تحيّتك",
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: false
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error('❌ خطأ في تنفيذ أمر السلام:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `حدث خطأ أثناء تنفيذ الأمر:\n${error.message || error.toString()}`
      }, { quoted: msg });
    }
  }
}