const { getProfilePicture } = require("@whiskeysockets/baileys");

module.exports = {
  command: "احسب",
  description: "رد تلقائي على كلمة احسب",
  usage: ".احسب",
  category: "fun",

  async execute(sock, msg) {
    try {
      const replies = [
        "ليه احسب ايه يا غالي😂",
        "احسب ايه يا قلبي؟😂",
        "احسبها على ايه بالظبط؟😂",
        "احسبها ايه يا حبيبي؟😂",
        "احسبها ايه يا روحي؟😂",
        "ليه بس يا عمري؟😂",
        "لا لا لا لا😂😂",
        "احسبها ايه يا باشا؟😂",
        "احسبها ايه يا صاحبي؟😂",
        "احسبها ايه يا اخويا؟😂",
        "احسبها ايه يا عم؟😂",
        "احسبها ايه يا غالي؟😂",
        "احسبها ايه يا بعد قلبي؟😂",
        "احسبها ايه يا عيوني؟😂",
        "احسبها ايه يا باشا؟😂",
        "احسبها ايه يا حبيبي؟😂",
        "احسبها ايه يا روحي؟😂",
        "احسبها ايه يا قلبي؟😂",
        "احسبها ايه يا عمري؟😂",
        "احسبها ايه يا بعد قلبي؟😂"
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
            title: "🟢احسب ايه",
            body: "رد تلقائي من ❄ مـــجـــهـــول 𝑩𝒐𝒕꧂",
            thumbnailUrl: pfp,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: false
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error("❌ خطأ في أمر 'احسب':", error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${error.message || error.toString()}`
      }, { quoted: msg });
    }
  }
};
