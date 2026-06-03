const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  command: "😂",
  description: "رد على الضحكه",
  usage: ".😂",
  category: "ترفيه",

  async execute(sock, msg) {
    try {
      const replies = [
        "دوم الضحكه ي حب🐦‍⬛💗",
        "تدوم الضحكه العسل دي يا عسل 😉",
        "تضحك علي ايه ضحكني معاك😂",
        "اخخخخ ي الضحكه الجميله دي بس الله بدومها🐤💗",
        "يويلي علي الضحكه ادوب انا ادوب😻",
        "دامت إن شاء الله حب الضحكه العسل دي🫦"
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      // ✅ إرسال الرد
      await sock.sendMessage(msg.key.remoteJid, {
        text: randomReply
      }, { quoted: msg });

    } catch (error) {
      console.error('❌ خطأ في أمر "😂":', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `حصل خطأ:\n${error.message || error.toString()}`
      }, { quoted: msg });
    }
  }
};