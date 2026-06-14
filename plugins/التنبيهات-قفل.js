const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, '..', 'db');
const dbFile = path.join(dbDir, 'الكودالزق.json');

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

function loadAlertsDB() {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}
function saveAlertsDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

module.exports = {
  command: ['التنبيهات-قفل'],
  description: 'إيقاف التنبيهات لتغييرات الأدمن والإعدادات في هذا الجروب.',
  category: 'group',

  async execute(sock, msg) {
    const groupId = msg.key?.remoteJid;
    if (!groupId || !groupId.endsWith('@g.us')) {
      return sock.sendMessage(groupId, { text: '⚠️ هذا الأمر يعمل في الجروبات فقط.' });
    }

    // ✅ تحقق أن اللي مشغل الأمر أدمن
    const metadata = await sock.groupMetadata(groupId);
    const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
    if (!admins.includes(sender)) {
      return sock.sendMessage(groupId, { text: '⚠️ هذا الأمر مسموح للأدمنز فقط.' });
    }

    const db = loadAlertsDB();
    if (!db[groupId]) {
      return sock.sendMessage(groupId, { text: '⚠️ التنبيهات مش مفعلة أصلاً في هذا الجروب.' });
    }

    delete db[groupId];
    saveAlertsDB(db);

    await sock.sendMessage(groupId, { text: '❌ تم إيقاف التنبيهات في هذا الجروب.' });
  }
};