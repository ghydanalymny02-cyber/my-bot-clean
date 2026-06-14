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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  command: ['زواجهم'],
  category: 'مرح',
  description: 'زواج عشوائي بين شخصين من المجموعة مع مازون عشوائي',
  usage: '.زواج عشوائي',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    const metadata = await sock.groupMetadata(chatId);
    const allParticipants = metadata.participants.map(p => p.id);

    // استبعاد الأرقام غير الصالحة
    const validUsers = allParticipants.filter(p => !p.startsWith('status@') && p !== '0@s.whatsapp.net');

    if (validUsers.length < 3) {
      await sock.sendMessage(chatId, {
        text: '🚫 يجب أن يكون هناك 3 أعضاء على الأقل في المجموعة.',
      }, { quoted: msg });
      return;
    }

    const marriages = loadMarriages();

    // فلترة الغير متزوجين فقط
    const unmarried = validUsers.filter(user =>
      !Object.values(marriages).some(pair => pair.includes(user))
    );

    if (unmarried.length < 3) {
      await sock.sendMessage(chatId, {
        text: '💔 لا يوجد عدد كافٍ من الأشخاص غير المتزوجين.',
      }, { quoted: msg });
      return;
    }

    // اختيار 3 أشخاص عشوائيين غير مكررين
    let [person1, person2, person3] = [];

    while (true) {
      const shuffled = unmarried.sort(() => Math.random() - 0.5);
      [person1, person2, person3] = shuffled.slice(0, 3);
      if (person1 !== person2 && person1 !== person3 && person2 !== person3) break;
    }

    const [husband, wife, officiant] = [person1, person2, person3];

    // تسجيل الزواج
    marriages[husband] = [husband, wife];
    saveMarriages(marriages);

    await sock.sendMessage(chatId, {
      text: `
💞🌟 *✨ مبروك الزواج العشوائي ✨* 🌟💞

╔═══════════════╗
👰 *الزوجة:* @${wife.split('@')[0]}
🤵 *الزوج:* @${husband.split('@')[0]}
*المازون🧙‍♀️:* @${officiant.split('@')[0]}
╚═══════════════╝

💘 *زواج من اختيار القدر، نتمنى لكم السعادة.* 💘
🌹 *بارك الله لكما وبارك عليكما وجمع بينكما في خير.* 🌹
مـــجـــهـــول⊰𝑩𝑶𝑻 ❄️`,
      mentions: [husband, wife, officiant]
    }, { quoted: msg });
  }
};