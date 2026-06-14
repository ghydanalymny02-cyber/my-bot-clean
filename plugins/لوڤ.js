const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  command: "لوڤ",
  description: "رسالة حب قصيرة عشوائية",
  usage: ".لوڤ",
  category: "romance",

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
      } catch (e) {}

      if (!imageBuffer) {
        const fallbackPath = path.join(process.cwd(), "image.jpeg");
        if (fs.existsSync(fallbackPath)) imageBuffer = fs.readFileSync(fallbackPath);
      }

      const replies = [
        "❤️ أحبك أكثر من أي شيء",
        "💞 أنت قلبي وروحي",
        "🌹 لا أستطيع العيش بدونك",
        "💫 كل يوم أحبك أكثر",
        "🫀 أنت حبي الأبدي",
        "🤍 وجودك يجعل حياتي جميلة",
        "✨ أنت الأمان والسعادة بالنسبة لي",
        "🌸 أحب ضحكتك وروحك الجميلة",
        "💖 قلبي ملك لك وحدك",
        "🌟 أحبك بلا حدود",
        "🕊️ أنت فرحي الذي لا ينتهي",
        "💌 كل أفكاري معك",
        "💝 لا شيء يهمني إلا أنت",
        "💫 معك أشعر بالسلام",
        "🌹 أنت عالمي كله",
        "❤️ أحبك من قلبي",
        "💞 أنت بداية كل شيء جميل",
        "🌸 قلبي ينبض باسمك",
        "✨ لا يمكنني نسيانك",
        "🫀 أنت السبب في ابتسامتي",
        "💖 كل لحظة معك كنز",
        "🤍 أحبك بكل تفاصيلك",
        "🌟 أنت الحلم الذي تحقق",
        "💌 أحبك بلا سبب",
        "🕊️ معك كل شيء ممكن",
        "💫 أنت أمنيتي الكبيرة",
        "🌹 قلبي ملكك دائمًا",
        "❤️ أحبك أكثر مما تتصور",
        "💞 وجودك يملأ حياتي نورًا",
        "🌸 أنت سعادتي اليومية",
        "✨ كل كلمة منك تسعدني",
        "🫀 أحبك كما أنت",
        "💖 لا أحد يشبه حبنا",
        "🤍 أحبك في كل لحظة",
        "🌟 أنت حياتي وروحي",
        "💌 أحبك أكثر من الأمس",
        "🕊️ أنت الأمل الذي أعيشه",
        "💫 أحبك بلا شروط",
        "🌹 أنت عالمي وسعادتي",
        "❤️ كل شيء جميل بوجودك",
        "💞 أنت سبب كل سعادتي",
        "🌸 أحبك كما لم أحب أحدًا",
        "✨ قلبي لا يعرف إلا حبك",
        "🫀 معك أشعر بالكمال",
        "💖 كل يوم أحبك أكثر وأكثر",
        "🤍 أنت كل شيء بالنسبة لي",
        "🌟 حبك يجعلني أقوى",
        "💌 أنا لك وأنت لي",
        "🕊️ أحبك بلا نهاية",
        "💫 قلبي لا يضم سواك",
        "🌹 أحبك بكل جوارحي"
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      await sock.sendMessage(msg.key.remoteJid, {
        text: randomReply,
        contextInfo: {
          externalAdReply: {
            title: "مـــجـــهـــول 𝑩𝑶𝑻 🌋",
            body: "مـــجـــهـــول ♔",
            thumbnail: imageBuffer,
            mediaType: 1,
            sourceUrl: "https://example.com",
            renderLargerThumbnail: false,
            showAdAttribution: true
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error("❌ خطأ في أمر لوڤ:", error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `حدث خطأ:\n${error.message}`
      }, { quoted: msg });
    }
  }
};