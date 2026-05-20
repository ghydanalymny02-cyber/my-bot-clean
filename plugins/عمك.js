const { getProfilePicture } = require("@whiskeysockets/baileys");

module.exports = {
  command: "عمك",
  description: "رد مهين على كلمة عمك",
  usage: ".عمك",
  category: "fun",

  async execute(sock, msg) {
    try {
      const replies = [
        "أنا عمك؟ دا انت نهايتك حزينة 🫤",
        "عيب تقول كده، أنا أتبرى منك 😤",
        "انت تبقى عيل مش ابن 🤐",
        "عمك؟ لا والله، دي مصيبة لو حقيقي 😩",
        "لو أنا عمك يبقى انت كارثة النسب 😶",
        "مافيش قرابة، الحمد لله 🥲",
        "أنا مش مسؤول عنك لا شرعًا ولا قانونًا 🧨",
        "ده انت آخر واحد أتمناه قريب 🫠",
        "قولها تاني وهبلغ عنك رسميًا 😑",
        "والنبي متقول كده قدام الناس 😳"
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const senderId = msg.key.participant || msg.key.remoteJid;

      let pfp = null;
      try {
        pfp = await sock.profilePictureUrl(senderId, 'image');
      } catch {}

      await sock.sendMessage(msg.key.remoteJid, {
        text: randomReply,
        contextInfo: {
          externalAdReply: {
            title: "🙄 عمك؟ مش أفتخر والله",
            body: "رد ساخر من مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 👑",
            thumbnailUrl: pfp,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: false
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error("❌ خطأ في أمر 'عمك':", error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${error.message || error.toString()}`
      }, { quoted: msg });
    }
  }
};