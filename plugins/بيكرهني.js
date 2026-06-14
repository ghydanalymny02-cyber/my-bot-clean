module.exports = {
  command: ['بيكرهني'],
  description: 'مزاح: اختيار عضو عشوائي كأكثر شخص بيكرهك 😔',
  category: 'ترفيه',
  usage: '.بيكرهني',
  group: true,

  async execute(sock, msg) {
    // جلب بيانات الجروب مباشرة
    const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
    let ps = groupMetadata.participants.map(v => v.id);

    if (ps.length < 2) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ عدد الأعضاء قليل عشان نقدر نحدد مين بيكرهك 😅',
      }, { quoted: msg });
    }

    const toM = a => '@' + a.split('@')[0];
    const self = msg.key.participant || msg.sender; // الشخص اللي بيديله الأمر

    // اخفاء نفس الشخص من القائمة
    ps = ps.filter(v => v !== self);

    // دالة لاختيار عنصر عشوائي
    const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

    let a = getRandom(ps);
    let b;
    do {
      b = getRandom(ps);
    } while (b === a && ps.length > 1);

    const text = `▣──────────────────
│
* 💔 اكثر واحد هنا بيكرهك 😔*
▣─❧ ${toM(a)} 
│
▣──────────────────`;

    await sock.sendMessage(msg.key.remoteJid, {
      text,
      mentions: [a, b] // زي معاهده بالظبط
    }, { quoted: msg });
  }
};