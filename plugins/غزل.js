const { extractPureNumber } = require('../haykala/elite');

module.exports = {
  command: 'غزل',
  description: '😍 منشن شخص وغازله برسالة لطيفة',
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
          text: '📌 رد على رسالة الشخص اللي عايز تغازله.'
        }, { quoted: msg });
      }

      // اختار رسالة غزل عشوائية
      const compliments = [
        "عيونك فيها سحر مش طبيعي 😍",
        "لو الجمال كان إنسان، أكيد هيكون أنت ✨",
        "كل مرة بشوفك، ببتسم من غير سبب ❤️",
        "إنت مش بس حلو، إنت فتنة تمشي على الأرض 😘",
        "إنت السبب إني بحب القروب ده! 😉"
      ];
      const flirt = compliments[Math.floor(Math.random() * compliments.length)];

      return sock.sendMessage(groupJid, {
        text: `${flirt}`,
        mentions: [quotedParticipant]
      }, { quoted: msg });

    } catch (err) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};