const { extractPureNumber } = require('../haykala/elite');

module.exports = {
  command: 'تحرش',
  description: '😈 منشن شخص وتحرش بيه بكلام رومانسي كتير',
  category: 'fun',

  async execute(sock, msg, args = []) {
    try {
      const groupJid = msg.key.remoteJid;

      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, {
          text: '❌ هذا الأمر يعمل فقط في القروبات.'
        }, { quoted: msg });
      }

      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

      if (!quoted || !quotedParticipant) {
        return sock.sendMessage(groupJid, {
          text: '📌 لازم ترد على رسالة الشخص اللي عايز تتحرش بيه (رومانسيًا 😅).'
        }, { quoted: msg });
      }

      const flirts = [
        "عيونك بتسحرني كل مرة أشوفك فيها، بصراحة إنت خطر على قلبي 😍🔥",
        "أنا مش عارف أركز لما تكون موجود، كل تفكيري فيك إنت وبس 😌❤️",
        "إنت مش بس حلو، إنت فتنة تمشي على الأرض، وقلبي مش مستحمل 😘",
        "ضحكتك دوّبتني، وصوتك موسيقى بترقص جوه قلبي 💓🎶",
        "كل مرة بتتكلم، بحس إن الدنيا وقفت علشان أسمعك 👂💖",
        "أنا مش بحبك... أنا مدمن وجودك حرفيًا 😩💘",
        "إنت نوعي المفضل من الإدمان، ومالوش علاج 😏💞",
        "كل يوم بشوفك فيه بيبقى عيد، إنت سبب النور اللي في حياتي 🎉🌟",
        "لو كنت كلمة، كنت أكتر كلمة بحب أقولها طول اليوم 🥰📖",
        "قلبك طيب وشكلك قاتل... يعني مفيش مفر 😈💗"
      ];

      const message = flirts[Math.floor(Math.random() * flirts.length)];

      return sock.sendMessage(groupJid, {
        text: message,
        mentions: [quotedParticipant]
      }, { quoted: msg });

    } catch (err) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};