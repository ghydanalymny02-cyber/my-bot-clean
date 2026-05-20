const fs = require('fs');
const path = require('path');

// اسم ملف قاعدة البيانات تم تعديله
const dbDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dbDir, 'welcoome.json');

// تأكد من وجود المجلد والملف
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

function loadWelcomeDB() {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}
function saveWelcomeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// نفس مخزن منع التكرار
if (!globalThis.__welcomedOnce) globalThis.__welcomedOnce = new Set();

module.exports = {
  command: ['الترحيب-قفل'],
  description: 'تعطيل الترحيب بالأعضاء الجدد في هذا الجروب.',
  category: 'group',
  async execute(sock, msg) {
    const groupId = msg.key?.remoteJid;
    if (!groupId || !groupId.endsWith('@g.us')) {
      return sock.sendMessage(groupId, { text: 'هذا الأمر يعمل في الجروبات فقط.' });
    }
    // ✅ تحقق أن اللي مشغل الأمر أدمن
    const metadata = await sock.groupMetadata(groupId);
    const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
    if (!admins.includes(sender)) {
      return sock.sendMessage(groupId, { text: '⚠️ هذا الأمر مسموح للأدمنز فقط.' });
    }
    

    const db = loadWelcomeDB();
    const isActive = !!db[groupId];

    if (!isActive) {
      return sock.sendMessage(groupId, { text: '⚠️ الترحيب مقفول بالفعل.' });
    }

    // اقفل الترحيب واحفظ
    db[groupId] = false;
    saveWelcomeDB(db);

    // امسح أي قيود مؤقتة تخص هذا الجروب
    for (const key of Array.from(globalThis.__welcomedOnce)) {
      if (key.startsWith(`${groupId}:`)) globalThis.__welcomedOnce.delete(key);
    }

    await sock.sendMessage(groupId, { text: '⛔ تم تعطيل الترحيب بالأعضاء الجدد.' });
  }
};
