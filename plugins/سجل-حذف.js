const fs = require('fs');
const path = require('path');

const dbFile = path.resolve(__dirname, '../data/members.json');
const imageDir = path.resolve(__dirname, '../resources');

function loadDB() {
  if (!fs.existsSync(dbFile)) return {};
  return JSON.parse(fs.readFileSync(dbFile));
}

function saveDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

module.exports = {
  command: 'سجل-حذف',
  description: '🗑️ حذف بياناتك الشخصية بالكامل.',
  category: 'tools',
  async execute(sock, msg) {
    const sender = (msg.key.participant || msg.key.remoteJid).split('@')[0];
    const db = loadDB();

    if (!db[sender]) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❗️مفيش بيانات مسجلة ليك.',
      }, { quoted: msg });
    }

    if (db[sender].image && fs.existsSync(db[sender].image)) {
      fs.unlinkSync(db[sender].image);
    }

    delete db[sender];
    saveDB(db);

    return sock.sendMessage(msg.key.remoteJid, {
      text: '✅ تم حذف بياناتك وكل ما يخصك من قاعدة البيانات.',
    }, { quoted: msg });
  }
};