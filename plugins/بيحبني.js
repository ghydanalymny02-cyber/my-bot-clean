module.exports = {
  command: ['بيحبني'],
  description: 'مزاح: اختيار عضو من الجروب كأكثر شخص بيحبك 😍',
  category: 'ترفيه',
  usage: '.بيحبني',
  group: true,

  async execute(sock, msg) {
    // جلب بيانات الجروب مباشرة
    const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
    const ps = groupMetadata.participants.map(v => v.id);

    if (ps.length < 2) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ عدد الأعضاء قليل عشان نقدر نحدد مين بيحبك 😅',
      }, { quoted: msg });
    }

    const toM = a => '@' + a.split('@')[0];

    // اختيار عضو عشوائي
    const a = ps[Math.floor(Math.random() * ps.length)];
    let b;
    do {
      b = ps[Math.floor(Math.random() * ps.length)];
    } while (b === a && ps.length > 1);

    const text = `▣──────────────────
│
* 💗✨ اكثر واحد هنا بيحبك هو *
▣─❧ ${toM(a)} 
│
▣──────────────────`;

    await sock.sendMessage(msg.key.remoteJid, {
      text,
      mentions: [a, b] // زي معاهده حتى لو مش تمام
    }, { quoted: msg });
  }
};