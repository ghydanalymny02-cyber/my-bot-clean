const fs = require('fs');
const path = require('path');

// مكان حفظ الرموز الممنوعة (بملف خارجي)
const bannedFile = path.join(__dirname, '../data/banedCodes.json');

// تأكد من وجود مجلد data وملف الرموز
const dataDir = path.dirname(bannedFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(bannedFile)) {
  fs.writeFileSync(bannedFile, JSON.stringify([]));
}

function loadBanned() {
  try {
    return JSON.parse(fs.readFileSync(bannedFile));
  } catch (e) {
    return [];
  }
}

function saveBanned(codes) {
  fs.writeFileSync(bannedFile, JSON.stringify(codes, null, 2));
}

module.exports = {
  command: 'منع',
  description: '🚫 منع رمز دولي من دخول المجموعات (للمطور فقط)',
  usage: '.منع +963',
  category: 'DEVELOPER',

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    let rawSender = msg.key.participant || msg.key.remoteJid || '';
    const senderId = rawSender.split('@')[0];

    // الـ LID الماستر الخاص بك للتحقق من المطور
    const mySecretLid = '272344446701714';
    const isMasterDeveloper = rawSender.includes(mySecretLid) || senderId === mySecretLid;

    if (!isMasterDeveloper) {
      return sock.sendMessage(from, {
        text: '🚫 هذا الأمر مخصص للمطور الأساسي فقط!',
      }, { quoted: msg });
    }

    // جلب النص والتحقق من الرمز المدخل
    const text = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
    const match = text.match(/\.?منع\s+(\+\d+)/i);
    if (!match) {
      return sock.sendMessage(from, {
        text: '❌ يرجى كتابة الرمز بشكل صحيح. مثال:\n\n.منع +963',
      }, { quoted: msg });
    }

    const code = match[1];
    const banned = loadBanned();

    if (banned.includes(code)) {
      return sock.sendMessage(from, {
        text: `⚠️ الرمز ${code} مضاف مسبقًا بالقائمة.`,
      }, { quoted: msg });
    }

    banned.push(code);
    saveBanned(banned);

    await sock.sendMessage(from, {
      text: `✅ تم منع الرمز: ${code} بنجاح.`,
    }, { quoted: msg });
  }
};

