const fs = require('fs');
const path = require('path');

// اسم ملف قاعدة البيانات
const dbDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dbDir, 'farewell.json');

// تأكد من وجود المجلد والملف
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

function loadFarewellDB() {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

function saveFarewellDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// نفس مخزن منع التكرار — هننضّفه للجروب لما نقفل
if (!globalThis.__farewelledOnce) globalThis.__farewelledOnce = new Set();

module.exports = {
  command: ['وداع-قفل'],
  description: 'تعطيل الوداع عند مغادرة الأعضاء للمجموعة.',
  category: 'group',
  async execute(sock, msg) {
    const groupId = msg.key?.remoteJid;
    if (!groupId || !groupId.endsWith('@g.us')) {
      return sock.sendMessage(groupId, { text: 'هذا الأمر يعمل في الجروبات فقط.' });
    }

    const db = loadFarewellDB();
    const isActive = !!db[groupId];

    if (!isActive) {
      return sock.sendMessage(groupId, { text: '⚠️ الوداع مقفول بالفعل.' });
    }

    // اقفل الوداع واحفظ
    db[groupId] = false;
    saveFarewellDB(db);

    // امسح أي قيود مؤقتة تخص هذا الجروب
    for (const key of Array.from(globalThis.__farewelledOnce)) {
      if (key.startsWith(`${groupId}:`)) globalThis.__farewelledOnce.delete(key);
    }

    await sock.sendMessage(groupId, { text: '⛔ تم تعطيل الوداع عند مغادرة الأعضاء.' });
  }
};
