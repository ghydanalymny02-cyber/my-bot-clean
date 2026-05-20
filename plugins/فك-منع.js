const fs = require('fs');
const path = require('path');

// مسار ملف الرموز الممنوعة
const bannedFile = path.join(__dirname, '../data/banedCodes.json');

// أرقام المطورين المسموح لهم باستخدام الأمر
const developers = ['201116880068', '182321764417751']; // عدل ID حسب أرقامك

function loadBanned() {
  return fs.existsSync(bannedFile) ? JSON.parse(fs.readFileSync(bannedFile)) : [];
}

function saveBanned(codes) {
  fs.writeFileSync(bannedFile, JSON.stringify(codes, null, 2));
}

module.exports = {
  command: 'فك-منع',
  description: '✅ فك الحظر عن رمز دولي',
  usage: '.فك-منع +966',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderId = sender.split('@')[0];

    // تحقق من صلاحية المطور
    if (!developers.includes(senderId)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 هذا الأمر مخصص للمطور فقط!',
      }, { quoted: msg });
    }

    // استخراج النص الكامل من الرسالة
    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.body ||
      '';

    // استخراج الرمز باستخدام regex
    const match = text.match(/(?:\.فك-منع|فك-منع)\s+(\+\d+)/i);

    if (!match) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❌ اكتب الرمز المطلوب إلغاء حظره. مثال:\n\n.فك-منع +963',
      }, { quoted: msg });
    }

    const code = match[1];
    let banned = loadBanned();

    // تحقق إذا كان الرمز موجود بالفعل
    if (!banned.includes(code)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ الرمز ${code} غير موجود في القائمة.`,
      }, { quoted: msg });
    }

    // حذف الرمز من القائمة
    banned = banned.filter(c => c !== code);
    saveBanned(banned);

    await sock.sendMessage(msg.key.remoteJid, {
      text: `✅ تم إلغاء حظر الرمز: ${code}`,
    }, { quoted: msg });
  }
};