const fs = require('fs');
const path = require('path');

const vipFile = path.join(__dirname, '../haykala/vip.json');

function loadVIP() {
  if (!fs.existsSync(vipFile)) return [];
  try { return JSON.parse(fs.readFileSync(vipFile, 'utf8')); } catch (e) { return []; }
}

function saveVIP(list) {
  fs.writeFileSync(vipFile, JSON.stringify(list, null, 2));
}

module.exports = {
  command: ['vip', 'فيب'],
  description: '🎖️ نظام VIP كامل ⏤͟͟͞ستايل يوميلا',
  usage: '.vip إضافة/حذف/عرض [منشن]',
  category: 'group',

  async execute(sock, msg, args) {
    try {
      const groupJid = msg.key.remoteJid;
      if (!groupJid.endsWith('@g.us')) return sock.sendMessage(groupJid, { text: '🚫 هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: msg });

      const sender = msg.key.participant || msg.key.remoteJid;
      const metadata = await sock.groupMetadata(groupJid);
      const isAdmin = metadata.participants.find(p => p.id === sender)?.admin;

      if (!isAdmin) return sock.sendMessage(groupJid, { text: '❌ هذا الأمر خاص بالمشرفين فقط.' }, { quoted: msg });

      let vipList = loadVIP();
      const action = args[0];
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

      // عرض القائمة
      if (action === 'عرض') {
        if (vipList.length === 0) return sock.sendMessage(groupJid, { text: '📭 قائمة الـ VIP فارغة.' }, { quoted: msg });
        let text = `🎖️ *قائمة الـ VIP الحالية:*\n\n`;
        vipList.forEach((id, index) => { text += `${index + 1}- @${id.split('@')[0]}\n`; });
        return sock.sendMessage(groupJid, { text, mentions: vipList }, { quoted: msg });
      }

      // إضافة أو حذف
      if (!mentioned) return sock.sendMessage(groupJid, { text: '⚠️ يرجى عمل منشن للشخص المطلوب.' }, { quoted: msg });

      if (action === 'إضافة') {
        if (vipList.includes(mentioned)) return sock.sendMessage(groupJid, { text: '⚠️ هذا العضو موجود مسبقاً في قائمة الـ VIP.' }, { quoted: msg });
        vipList.push(mentioned);
        saveVIP(vipList);
        sock.sendMessage(groupJid, { text: `✅ تم إضافة @${mentioned.split('@')[0]} إلى قائمة الـ VIP.`, mentions: [mentioned] }, { quoted: msg });
      } else if (action === 'حذف') {
        if (!vipList.includes(mentioned)) return sock.sendMessage(groupJid, { text: '⚠️ العضو ليس في قائمة الـ VIP.' }, { quoted: msg });
        vipList = vipList.filter(id => id !== mentioned);
        saveVIP(vipList);
        sock.sendMessage(groupJid, { text: `✅ تم حذف @${mentioned.split('@')[0]} من قائمة الـ VIP.`, mentions: [mentioned] }, { quoted: msg });
      } else {
        sock.sendMessage(groupJid, { text: '⚠️ استخدام خاطئ. استخدم:\n.vip إضافة/حذف/عرض' }, { quoted: msg });
      }

    } catch (err) {
      console.error(err);
      sock.sendMessage(msg.key.remoteJid, { text: '❌ حدث خطأ في النظام.' }, { quoted: msg });
    }
  }
};
