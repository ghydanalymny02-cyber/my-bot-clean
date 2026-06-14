const axios = require("axios");
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = require("@whiskeysockets/baileys");

module.exports = {
  name: "دايت",
  command: ["دايت"],
  category: "media",
  description: "يعرض مقاطع ايديت تيك توك في عرض تفاعلي جميل 🌋",

  async execute(sock, msg, args = []) {
    const jid = msg.key.remoteJid;
    const query =
      args.join(" ").trim() ||
      msg.message?.conversation?.split(" ").slice(1).join(" ") ||
      msg.message?.extendedTextMessage?.text?.split(" ").slice(1).join(" ");

    const footer = " مـــجـــهـــول⊰𝑩𝑶𝑻 ❄";

    if (!query) {
      return sock.sendMessage(
        jid,
        { text: "⚠️ أدخل الكلمة اللي عايز تبحث عنها.\n\nمثال: *.دايت naruto*" },
        { quoted: msg }
      );
    }

    try {
      await sock.sendMessage(jid, { react: { text: "🎬", key: msg.key } });
      await sock.sendMessage(jid, { text: "```⏳ جاري البحث عن ايديتات ...```" }, { quoted: msg });

      const searchQuery = `${query} edit`;
      const { data } = await axios.get(
        `https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(searchQuery)}`
      );

      let results = data?.data || [];

      if (results.length === 0) {
        await sock.sendMessage(jid, { react: { text: "❌", key: msg.key } });
        return sock.sendMessage(jid, { text: `❌ لم يتم العثور على نتائج لـ *${query}*` }, { quoted: msg });
      }

      // خلط عشوائي للنتائج
      for (let i = results.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [results[i], results[j]] = [results[j], results[i]];
      }

      const selected = results.slice(0, 6);
      let cards = [];

      async function createVideoMedia(url) {
        return await prepareWAMessageMedia({ video: { url } }, { upload: sock.waUploadToServer });
      }

      for (let vid of selected) {
        const videoMedia = await createVideoMedia(vid.nowm);
        const cleanTitle =
          vid.title
            ?.split(" ")
            ?.filter((w) => !w.startsWith("#") && !w.startsWith("@"))
            ?.join(" ") || "edit❄";

        cards.push({
          body: { text: "" },
          footer: { text: footer },
          header: {
            title: cleanTitle,
            hasMediaAttachment: true,
            videoMessage: videoMedia.videoMessage || videoMedia,
          },
          nativeFlowMessage: { buttons: [] },
        });
      }

      // بناء الرسالة النهائية بدون fromObject()
      const finalMessage = {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: `🎥 نتائج البحث عن: *${query}*` },
              footer: { text: footer },
              carouselMessage: { cards },
            },
          },
        },
      };

      const waMsg = generateWAMessageFromContent(jid, finalMessage, { quoted: msg });
      await sock.relayMessage(jid, waMsg.message, { messageId: waMsg.key.id });
      await sock.sendMessage(jid, { react: { text: "✅", key: msg.key } });
    } catch (error) {
      console.error("❌ خطأ في ايديت:", error);
      await sock.sendMessage(jid, { react: { text: "❌", key: msg.key } });
      await sock.sendMessage(
        jid,
        { text: `⚠️ حصل خطأ أثناء تنفيذ الأمر:\n${error.message}` },
        { quoted: msg }
      );
    }
  },
};