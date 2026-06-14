const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, '..', 'db');
const dbFile = path.join(dbDir, 'marriages.json');

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

function loadMarriages() {
  try {
    return JSON.parse(fs.readFileSync(dbFile));
  } catch {
    return {};
  }
}

function saveMarriages(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

module.exports = {
  command: ['طلقهم'],
  category: 'ترفيه',
  description: 'إجراء طلاق عشوائي بين زوجين مسجلين',
  usage: '.طلقهم',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❗ هذا الأمر يعمل فقط داخل المجموعات.'
      }, { quoted: msg });
    }

    const marriages = loadMarriages();

    // تحويل الكائن إلى مصفوفة من الأزواج [زوج, زوجة]
    const marriedPairs = Object.entries(marriages)
      // لتجنب تكرار الأزواج (مثلاً الزوجة مسجلة عند الزوج والعكس)
      .filter(([key, value]) => key < value[1]);

    if (marriedPairs.length === 0) {
      return await sock.sendMessage(chatId, {
        text: '⚠️ لا يوجد أي زوجين مسجلين للطلاق العشوائي.'
      }, { quoted: msg });
    }

    // اختيار زوجين عشوائيًا
    const randomIndex = Math.floor(Math.random() * marriedPairs.length);
    const [husband, [_, wife]] = marriedPairs[randomIndex]; 
    // لاحظ: value = [?, زوجة] - هنا نفترض أن زوجة في value[1] حسب كودك السابق

    // حذف الزواج للطرفين
    delete marriages[husband];
    delete marriages[wife];
    saveMarriages(marriages);

    await sock.sendMessage(chatId, {
      text: `
💔 *تم الطلاق العشوائي* 💔

👰 سابقًا: @${wife.split('@')[0]}
🤵 سابقًا: @${husband.split('@')[0]}

نتمنى لهم حياة جديدة مليئة بالخير والسلام. ✨
> 𝒀𝑼𝑴𝑰𝑳𝑨ｼ ❄ 
      `,
      mentions: [husband, wife]
    }, { quoted: msg });
  }
};