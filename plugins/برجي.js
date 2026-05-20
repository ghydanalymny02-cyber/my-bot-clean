const zodiak = [
  ["♑ الجدي", new Date(1970, 0, 1)],
  ["♒ الدلو", new Date(1970, 0, 20)],
  ["♓ الحوت", new Date(1970, 1, 19)],
  ["♈ الحمل", new Date(1970, 2, 21)],
  ["♉ الثور", new Date(1970, 3, 21)],
  ["♊ الجوزاء", new Date(1970, 4, 21)],
  ["♋ السرطان", new Date(1970, 5, 22)],
  ["♌ الأسد", new Date(1970, 6, 23)],
  ["♍ العذراء", new Date(1970, 7, 23)],
  ["♎ الميزان", new Date(1970, 8, 23)],
  ["♏ العقرب", new Date(1970, 9, 23)],
  ["♐ القوس", new Date(1970, 10, 22)],
  ["♑ الجدي", new Date(1970, 11, 22)]
].reverse();

function getZodiac(month, day) {
  let d = new Date(1970, month - 1, day);
  return zodiak.find(([_, _d]) => d >= _d)[0];
}

module.exports = {
  command: 'برجي',
  description: '🪐 اعرف برجك وعُمرك من تاريخ ميلادك',
  usage: '.برجي 2005 05 25',
  category: 'tools',

  async execute(sock, msg, args) {
    // هنا هنجيب النص من args أو من body
    let text = args?.join(' ').trim();
    if (!text) {
      text = msg.message?.extendedTextMessage?.text ||
             msg.message?.conversation ||
             msg.body || '';
      text = text.replace(/^\.(برجي)\s*/i, '').trim();
    }

    if (!text) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ لازم تكتب تاريخ ميلادك.\n\nمثال:\n.برجي 2002 02 25`,
      }, { quoted: msg });
    }

    const parts = text.split(/\s+/);
    if (parts.length < 3) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ التاريخ غير صحيح! اكتب بالشكل: .برجي 2002 02 25',
      }, { quoted: msg });
    }

    const [year, month, day] = parts.map(p => parseInt(p));
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ التاريخ غير صحيح! اكتب بالشكل: .برجي 2002 02 25',
      }, { quoted: msg });
    }

    const d = new Date();
    const [tahun, bulan, tanggal] = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    const birth = [date.getFullYear(), date.getMonth() + 1, date.getDate()];

    const zodiac = getZodiac(birth[1], birth[2]);

    const ageD = new Date(d - date);
    const age = ageD.getFullYear() - new Date(1970, 0, 1).getFullYear();

    // هنا التعديل: نزود سنة لو عيد ميلاده النهارده أو عدى
    const birthday = [
      tahun + (
        (bulan > birth[1]) ||
        (bulan === birth[1] && tanggal > birth[2]) ||
        (bulan === birth[1] && tanggal === birth[2])
      ),
      ...birth.slice(1)
    ];

    const cekusia = bulan === birth[1] && tanggal === birth[2]
      ? `🎂🥳 كل سنة وانت طيب! 🎉 عيد ميلادك الـ ${age} النهارده `
      : `${age} سنة 🎈`;

    const teks = `
📅 تاريخ الميلاد : ${birth.join('-')}
🎁 عيد الميلاد القادم : ${birthday.join('-')}
👤 العمر : ${cekusia}
🪐 برجك : ${zodiac}
    `.trim();

    await sock.sendMessage(msg.key.remoteJid, { text: teks }, { quoted: msg });
  }
};