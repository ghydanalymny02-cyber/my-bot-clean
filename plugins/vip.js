// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹  🕸*
// 📄 *vip.js* (جزء 1/1):

const fs = require('fs');
const path = require('path');

const vipFile = path.join(__dirname, '../haykala/vip.json');

// تحميل ملف VIP
function loadVIP() {
  if (!fs.existsSync(vipFile)) return [];
  return JSON.parse(fs.readFileSync(vipFile));
}

// حفظ ملف VIP
function saveVIP(list) {
  fs.writeFileSync(vipFile, JSON.stringify(list, null, 2));
}

module.exports = {
  command: 'vip',
  description: '🎖️ نظام VIP كامل ⏤͟͟͞ستايل يوميلا',
  usage: '.vip إضافة/حذف/عرض',
  category: 'group',

  async execute(sock, msg, args) {
    try {
      const groupJid = msg.key.remoteJid;
      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, { text: '🚫 هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: msg });
      }

      const sender = msg.key.participant || msg.participant;
      const senderNum = sender.split('@')[0];

      // فقط الأونر أو الأدمنز
      const metadata = await sock.groupMetadata(groupJid);
      const adminList = metadata.participants.filter(p => p.admin).map(p => p.id.split('@')[0]);

      if (!adminList.includes(senderNum)) {