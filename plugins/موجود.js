const { getProfilePicture } = require("@whiskeysockets/baileys");

module.exports = {
  command: "موجود",
  description: "رد تلقائي على كلمة موجود",
  usage: ".موجود",
  category: "fun",

  async execute(sock, msg) {
    try {
      const replies = [
        "أهلاً بك يا غالي، أنا موجود.",
        "موجود يا بعد قلبي، إيش طلباتك؟",
        "يا روحي أنا موجود، في أي خدمة؟",
        "موجود يا عمري، تفضل.",
        "هلا بيك، موجود وفي انتظارك.",
        "يا هلا ومرحبا، أنا موجود.",
        "موجود يا حبيبي، لا تشيل هم.",
        "أهلاً وسهلاً، أنا موجود.",
        "موجود يا قلبي، أمرني.",
        "بخير وموجود يا غالي، أنت كيفك؟",
        "موجود يا نور عيني، إيش تحتاج؟",
        "أهلاً وسهلاً بك، أنا موجود.",
        "موجود يا روحي، تفضل يا قلبي.",
        "هلا بيك يا بعد قلبي، أنا موجود.",
        "موجود يا عمري، إيش طلباتك؟",
        "الحمدلله موجود، تفضل يا قلبي.",
        "أهلاً بك، أنا موجود وفي انتظارك.",
        "موجود يا حبيبي، لا تشيل هم.",
        "موجود يا صاحبي، تفضل.",
        "يا هلا باللي جانا، أنا موجود.",
        "موجود يا باشا، أمرني.",
        "أهلاً بك، أنا موجود وفي الخدمة.",
        "موجود يا روحي، كيف أقدر أساعدك؟",
        "موجود يا عمري، إيش الجديد؟",
        "هلا بيك يا غالي، أنا موجود."
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
            title: "🟢البوت موجود",
            body: "رد تلقائي من 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻 🌋",
            thumbnailUrl: pfp,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: false
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error("❌ خطأ في أمر 'موجود':", error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${error.message || error.toString()}`
      }, { quoted: msg });
    }
  }
};
