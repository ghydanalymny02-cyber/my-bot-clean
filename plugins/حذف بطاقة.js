const fs = require('fs');
const path = require('path');
const { isElite } = require('../haykala/elite.js'); // تأكد أن هذا الملف يحتوي دالة isElite

const dataDir = path.join(__dirname, '../data');
const profilesPath = path.join(dataDir, 'profiles.json');
const PROTECTED_ID = '967701227385@lid';

// التأكد من وجود مجلد data
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

function loadProfiles() {
  if (!fs.existsSync(profilesPath)) fs.writeFileSync(profilesPath, '{}');
  try {
    return JSON.parse(fs.readFileSync(profilesPath));
  } catch (e) {
    return {}; // في حال تلف الملف
  }
}

function saveProfiles(data) {
  fs.writeFileSync(profilesPath, JSON.stringify(data, null, 2));
}

module.exports = {
  command: 'بطاقةحذف',
  category: 'نخبة',
  description: 'حذف بطاقة شخص من البوت (مخصص للنخبة فقط)',
  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    if (!(await isElite(sender))) {
      return await sock.sendMessage(chatId, { text: '❌ هذا الأمر مخصص للنخبة فقط.' });
    }

    if (mentions.length === 0) {
      return await sock.sendMessage(chatId, { text: '❌ الرجاء منشن شخص لحذف بطاقته.' });
    }

    const target = mentions[0];

    if (target === PROTECTED_ID) {
      return await sock.sendMessage(chatId, { text: '🚫 لا يمكن حذف بطاقة هذا المستخدم المحمي.' });
    }

    const profiles = loadProfiles();

    if (!profiles[target]) {
      return await sock.sendMessage(chatId, { text: '⚠️ لا توجد بطاقة محفوظة لهذا الشخص.' });
    }

    delete profiles[target];
    saveProfiles(profiles);

    await sock.sendMessage(chatId, {
      text: `✅ تم حذف بطاقة الشخص: @${target.split('@')[0]}`,
      mentions: [target],
    });
  }
};