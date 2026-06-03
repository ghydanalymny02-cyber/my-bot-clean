module.exports = {
  command: ['بيبضني'],
  description: 'مزاح: اختيار عضو عشوائي كأكثر شخص بيبيض عليك البيض 😏🥚',
  category: 'ترفيه',
  usage: '.بيبضني',
  group: true,

  async execute(sock, msg) {
    // جلب بيانات الجروب مباشرة
    const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
    const ps = groupMetadata.participants.map(v => v.id);

    if (ps.length < 2) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ عدد الأعضاء قليل عشان نقدر نحدد مين بيبيض عليك 😅',
      }, { quoted: msg });
    }

    const toM = a => '@' + a.split('@')[0];

    // دالة لاختيار عنصر عشوائي
    const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

    const a = getRandom(ps);
    let b;
    do {
      b = getRandom(ps);
    } while (b === a && ps.length > 1);

    const text = `▣──────────────────
│
* 💗✨ اكثر واحد هنا بيبيض عليك البيض ده *
▣─❧ ${toM(a)} 
│
▣──────────────────`;

    await sock.sendMessage(msg.key.remoteJid, {
      text,
      mentions: [a, b] // زي معاهده بالظبط حتى لو مش تمام
    }, { quoted: msg });
  }
};