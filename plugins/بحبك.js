const { getProfilePicture } = require("@whiskeysockets/baileys");

module.exports = {
  command: "ريهام",
  description: "رد لطيف على كلمة بحبك",
  usage: ".بحبك",
  category: 'ترفيه',

  async execute(sock, msg) {
    try {
      const replies = [
        "وأنا كمان 💖",
        "دايمًا في القلب ❤️",
        "حب متبادل يا جميل 🫶",
        "بحبك أكتر 🥰",
        "ده كلام يفتح النفس 😍",
        "قلبي داب والله 🥹",
        "أحبك حب البوت للأوامر 🤖❤️",
        "أنا اعشقك 💋🫦",
        "كلنا بنحبك هنا 💫",
        "نورت قلبي بجد 💓"
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
            title: "💌 بحبك؟",
            body: "رد لطيف من  ♜𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂",
            thumbnailUrl: pfp,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: false
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error("❌ خطأ في أمر 'بحبك':", error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${error.message || error.toString()}`
      }, { quoted: msg });
    }
  }
};