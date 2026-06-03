module.exports = {
  command: ['صداقه'],
  description: 'تكوين صداقة مرحة بين عضوين في الجروب',
  category: 'ترفيه',
  usage: '.صداقه',
  group: true,

  async execute(sock, msg) {
    const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
    const participants = groupMetadata.participants.map(v => v.id);

    if (participants.length < 2) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ لازم يكون في عضوين على الأقل عشان نعمل صداقة!',
      }, { quoted: msg });
    }

    // اختيار شخصين عشوائيين
    const a = participants[Math.floor(Math.random() * participants.length)];
    let b;
    do {
      b = participants[Math.floor(Math.random() * participants.length)];
    } while (b === a);

    const senderJid = msg.key?.participant || msg.participant || msg.sender;
    const sender = senderJid.split('@')[0];
    const targetA = a.split('@')[0];
    const targetB = b.split('@')[0];

    const imageUrl = 'https://telegra.ph/file/2b0efc99afc0cfc69c3d8.jpg';

    const text = `
*✦┇لنكوّن بعض الأصدقاء┇✦*

👑 القائد: @${sender}
💌 العضو الأول: @${targetA}
💌 العضو الثاني: @${targetB}

───────── ❖ ─────────

*✦يا @${targetA} لتتحدث ف الخاص ↞ @${targetB} حتى يتمكنوا من اللعب ويصبحوا أصدقاء ✦*

*✦┇تبدأ أفضل الصداقات بالالعاب 😉┇✦*
`;

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: imageUrl },
      caption: text,
      mentions: [senderJid, a, b],
    }, { quoted: msg });
  }
};