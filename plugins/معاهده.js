module.exports = {
  command: ['معاهده'],
  description: 'توقيع معاهدة صلح وتحالف مع عضو',
  category: 'ترفيه',
  usage: '.معاهده @العضو',
  group: true,

  async execute(sock, msg) {
    const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!mention) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❌ منشن الشخص اللي عايز تعمل معاه المعاهدة.',
      }, { quoted: msg });
    }

    const senderJid = msg.key?.participant || msg.key?.remoteJid || msg.participant || msg.sender;
    if (!senderJid) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ لم يتم التعرف على المرسل.',
      }, { quoted: msg });
    }

    const sender = senderJid.split('@')[0];
    const target = mention.split('@')[0];

    const text = `
╭───〔 🤝 *مـعـاهـدة سـلام* 🤝 〕───╮

📜 *تم التوقيع على معاهدة صلح وتحالف مشترك* بين:

👑 القائد: @${sender}
⚔️ العضو: @${target}

───────── ❖ ─────────

📑 *بنود المعاهدة*:
1️⃣ وقف كافة الأعمال العدائية فورًا
2️⃣ دعم متبادل في جميع المعارك القادمة
3️⃣ الخيانة تؤدي إلى فسخ المعاهدة فورًا

📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}

🕊️ المعاهدة سارية حتى إشعار آخر...

╰──────〔  𝐁𝐎𝐓 مـــجـــهـــولｼ 〕──────╯`;

    await sock.sendMessage(msg.key.remoteJid, {
      text,
      mentions: [mention, senderJid]
    }, { quoted: msg });
  }
};