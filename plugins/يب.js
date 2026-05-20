const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  command: "يب",
  description: "رد ساخر لما تكتب 'يب'",
  usage: ".يب",
  category: "ترفيه",

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
        // تجاهل الخطأ لو فشل جلب صورة البروفايل
      }

      if (!imageBuffer) {
        const fallbackPath = path.join(process.cwd(), "image.jpeg");
        if (fs.existsSync(fallbackPath)) {
          imageBuffer = fs.readFileSync(fallbackPath);
        }
      }

      const replies = [
        "م تِسترجل يَ عم 🐦‍⬛ خلينا فـ الجد شوية!",
        "يب؟ يب إيه بس، قوم غيّر المود 🐸",
        "😒 يب! كأنك عملت إنجاز كبير!",
        "َيب يب يب... عايز رقصة ولا إيه؟ 💃",
        "😎 يب؟ سِيبك من اليَب وخش فـ الموضوع على طول",
        "م تقول نعم يَ عم و استرجل كدا 🐤"
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      await sock.sendMessage(msg.key.remoteJid, {
        text: randomReply,
        contextInfo: {
          externalAdReply: {
            title: "رد على 'يب' 💭",
            body: "خد رد يليق بيك 😂",
            thumbnail: imageBuffer,
            mediaType: 1,
            sourceUrl: "https://www.tikwm.com/video/media/play/7491809674505899294.mp4",
            renderLargerThumbnail: false,
            showAdAttribution: true
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error('❌ خطأ في أمر "يب":', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `حصل خطأ:\n${error.message || error.toString()}`
      }, { quoted: msg });
    }
  }
};