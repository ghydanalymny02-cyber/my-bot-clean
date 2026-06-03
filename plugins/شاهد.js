const { eliteNumbers, extractPureNumber } = require('../haykala/elite');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  command: ['شاهد'],
  description: '👀 تفاعل مع عضو في الجروب',
  category: 'DEVELOPER',
  usage: '.شاهد @العضو',
  group: true,

  async execute(sock, msg) {
    const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!mention) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❌ منشن الشخص اللي عايز تتفاعل معاه.',
      }, { quoted: msg });
    }

    const senderJid = msg.key?.participant || msg.key?.remoteJid || msg.participant || msg.sender;
    if (!senderJid) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ لم يتم التعرف على المرسل.',
      }, { quoted: msg });
    }

    const sender = extractPureNumber(senderJid);
    const target = mention.split('@')[0];

    // تحقق من صلاحية المرسل
    if (!eliteNumbers.includes(sender)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 ليس لديك صلاحية لاستخدام هذا الأمر!',
      }, { quoted: msg });
    }

    const messages = [
      `*@${target} عامل اي*`,
      `*@${target} امك عاملة اي*`,
      `*@${target} سلملي علي امك وقولها متنسيش بكرا ها*`,
      `*@${target} انا زهقت منك انطر يكسمك*`,
    ];

    for (let line of messages) {
      await sleep(2000);
      await sock.sendMessage(msg.key.remoteJid, {
        text: line,
        mentions: [mention]
      }, { quoted: msg });
    }
  }
};