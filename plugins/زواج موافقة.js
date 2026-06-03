const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const dataDir = path.join(baseDir, 'data');

const marriageFile = path.join(dataDir, 'marriages.json');
const pointsFile = path.join(dataDir, 'points.json');
const requestsFile = path.join(dataDir, 'marriage_requests.json');

const MADOON_ID = '137847696830664@lid';
const MADOON_NAME = '𝑭𝑶𝑿';

function loadJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch {
    return {};
  }
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getPoints(id, db) {
  return db[id] ||
    db[id.replace(/@s\.whatsapp\.net/, '@lid')] ||
    db[id.replace(/@lid/, '@s.whatsapp.net')] ||
    0;
}

function getPointsId(id, db) {
  if (db[id]) return id;
  const alt1 = id.replace(/@s\.whatsapp\.net/, '@lid');
  if (db[alt1]) return alt1;
  const alt2 = id.replace(/@lid/, '@s.whatsapp.net');
  if (db[alt2]) return alt2;
  return id;
}

function findRequestById(id, requestsDb) {
  if (requestsDb[id]) return id;
  const alt1 = id.replace(/@s\.whatsapp\.net/, '@lid');
  if (requestsDb[alt1]) return alt1;
  const alt2 = id.replace(/@lid/, '@s.whatsapp.net');
  if (requestsDb[alt2]) return alt2;
  return null;
}

module.exports = {
  command: ['موافقة'],
  category: 'عرس',
  description: 'قبول الزواج وإتمام العملية وخصم النقاط',
  usage: '.موافقة',

  async execute(sock, msg) {
    const sender = msg.sender || msg.key.participant || msg.key.remoteJid || '';
    const chatId = msg.key.remoteJid;

    const marriages = loadJSON(marriageFile);
    const points = loadJSON(pointsFile);
    const requests = loadJSON(requestsFile);

    const requestKey = findRequestById(sender, requests);

    if (!requestKey) {
      await sock.sendMessage(chatId, {
        text: '⚠️ ليس لديك طلب زواج للرد عليه.',
      }, { quoted: msg });
      return;
    }

    const proposer = requests[requestKey].from;

    if (marriages[proposer] || marriages[sender]) {
      await sock.sendMessage(chatId, {
        text: '❌ أحد الطرفين متزوج حالياً ولا يمكن إتمام الزواج.',
      }, { quoted: msg });
      delete requests[requestKey];
      saveJSON(requestsFile, requests);
      return;
    }

    const requiredPoints = 1500;
    const proposerPoints = getPoints(proposer, points);

    if (proposerPoints < requiredPoints) {
      await sock.sendMessage(chatId, {
        text: `❌ مقدم طلب الزواج (@${proposer.split('@')[0]}) لا يملك ${requiredPoints} نقطة كافية.\n💰 نقاطه الحالية: ${proposerPoints}`,
      }, { quoted: msg });
      return;
    }

    // تسجيل الزواج
    marriages[proposer] = [proposer, sender];
    saveJSON(marriageFile, marriages);

    // خصم النقاط من العريس
    const proposerId = getPointsId(proposer, points);
    points[proposerId] = proposerPoints - requiredPoints;

    // إضافة نقاط مهر للعروسة
    const brideId = getPointsId(sender, points);
    points[brideId] = (points[brideId] || 0) + 1000;

    saveJSON(pointsFile, points);

    delete requests[requestKey];
    saveJSON(requestsFile, requests);

    await sock.sendMessage(chatId, {
      text: `
💍💞 *✨ تهانينا بمناسبة الزواج ✨* 💞💍

┏━━━━━━━━━━━━━━━┓
👰 *الزوجة:* @${sender.split('@')[0]}
🤵 *الزوج:* @${proposer.split('@')[0]}
👨‍⚖️ *المأذون:* ${MADOON_NAME}
🔮 *المهر:* 1000 نقطة (أُضيفت)
💸 *الرسوم:* 500 نقطة (خصمت)
┗━━━━━━━━━━━━━━━┛

🌹 بارك الله لكما وجمع بينكما في خير 🌹

╭─────⎈─────╮
🔥 𝘽𝙊𝙏 𝘽𝙔: 『${MADOON_NAME}』
╰─────⎈─────╯
      `,
      mentions: [sender, proposer, MADOON_ID]
    }, { quoted: msg });
  }
};