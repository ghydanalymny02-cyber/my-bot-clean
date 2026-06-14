// حقوق ©️ مـــجـــهـــول
const fs = require('fs');
const path = require('path');

// إعداد المسارات
const baseDir = path.join(__dirname, '..');
const dataDir = path.join(baseDir, 'data');

const requestsFile = path.join(dataDir, 'marriage_requests.json');

// أدوات التحميل والحفظ
function loadJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function saveJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('خطأ أثناء حفظ الملف:', err);
  }
}

// البحث عن الطلب حسب ID
function findRequestById(id, db) {
  if (db[id]) return id;
  const alt1 = id.replace(/@s\.whatsapp\.net/, '@lid');
  if (db[alt1]) return alt1;
  const alt2 = id.replace(/@lid/, '@s.whatsapp.net');
  if (db[alt2]) return alt2;
  return null;
}

module.exports = {
  command: ['رفض'],
  category: 'عرس',
  description: 'رفض طلب الزواج وحذفه من القائمة',
  usage: '.رفض',

  async execute(sock, msg) {
    const sender = msg.sender || msg.key.participant || msg.key.remoteJid || '';
    const chatId = msg.key.remoteJid;

    const requests = loadJSON(requestsFile);
    const requestKey = findRequestById(sender, requests);

    if (!requestKey) {
      await sock.sendMessage(chatId, {
        text: `
⚠️ *عذرًا!*
🔍 لا يوجد أي طلب زواج موجه إليك حاليًا لرفضه.
        `.trim(),
      }, { quoted: msg });
      return;
    }

    const proposer = requests[requestKey].from;
    delete requests[requestKey];
    saveJSON(requestsFile, requests);

    await sock.sendMessage(chatId, {
      text: `
❌💔 *تم رفض طلب الزواج!* 💔❌

┏━━━━━━━━━━━━━━━┓
👤 *الرافض:* @${sender.split('@')[0]}
📨 *الطالب:* @${proposer.split('@')[0]}
🗑️ *تم حذف الطلب من السجل*
┗━━━━━━━━━━━━━━━┛

🔕 *نتمنى لك حظًا أوفر في المرات القادمة.*

╭─────⎈─────╮
🛡️ 𝘽𝙊𝙏 𝘽𝙔: 『مـــجـــهـــول』
╰─────⎈─────╯
      `.trim(),
      mentions: [sender, proposer]
    }, { quoted: msg });
  }
};