const fs = require('fs');
const path = require('path');

// مكان حفظ الرموز الممنوعة (بملف خارجي)
const bannedFile = path.join(__dirname, '../data/banedCodes.json');

// تأكد من وجود ملف الرموز
if (!fs.existsSync(bannedFile)) {
  fs.writeFileSync(bannedFile, JSON.stringify([]));
}

const developers = ['967715677073', '181020607422543']; // عدل ID حسب أرقامك

function loadBanned() {
  return JSON.parse(fs.readFileSync(bannedFile));
}

function saveBanned(codes) {
  fs.writeFileSync(bannedFile, JSON.stringify(codes, null, 2));
}

module.exports = {
  command: 'منع',
  description: '🚫 منع رمز دولي (للمطور فقط)',
  usage: '.منع +963',
  category: 'DEVELOPER',

  async execute(sock, msg, args) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderId = sender.split('@')[0];

    if (!developers.includes(senderId)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 هذا الأمر مخصص للمطور فقط!',
      }, { quoted: msg });
    }

    const text = msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.body || '';
    const match = text.match(/\.?منع\s+(\+\d+)/i);
    if (!match) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❌ يرجى كتابة الرمز بشكل صحيح. مثال:\n\n.منع +963',
      }, { quoted: msg });
    }

    const code = match[1];
    const banned = loadBanned();

    if (banned.includes(code)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ الرمز ${code} مضاف مسبقًا.`,
      }, { quoted: msg });
    }

    banned.push(code);
    saveBanned(banned);

    await sock.sendMessage(msg.key.remoteJid, {
      text: `✅ تم منع الرمز: ${code}`,
    }, { quoted: msg });
  }
};
// 1. تعريف كائن الإنذارات في أعلى الملف
if (!global.warnings) global.warnings = {};

module.exports = {
    name: 'حذف_انذار',
    category: 'admin',
    async execute(sock, message, args, { jid, sender, isGroup, participants }) {
        
        // التحقق من أن الأمر في مجموعة
        if (!isGroup) return sock.sendMessage(jid, { text: "❌ هذا الأمر للمجموعات فقط!" });

        // التحقق من صلاحيات المشرف
        const isAdmin = participants.find(p => p.id === sender)?.admin !== null;
        if (!isAdmin) return sock.sendMessage(jid, { text: "❌ هذا الأمر خاص بالمشرفين فقط!" });

        // جلب الشخص المراد تصفير إنذاراته (منشن أو رد)
        let mentionedUser = message.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] 
                            || message.message.extendedTextMessage?.contextInfo?.participant;

        if (!mentionedUser) {
            return sock.sendMessage(jid, { text: "⚠️ يرجى الرد على رسالة العضو أو عمل تاغ له." });
        }

        // تصفير الإنذارات
        if (global.warnings[jid] && global.warnings[jid][mentionedUser]) {
            global.warnings[jid][mentionedUser] = 0;
            await sock.sendMessage(jid, { text: `✅ تم تصفير إنذارات العضو @${mentionedUser.split('@')[0]}`, mentions: [mentionedUser] });
        } else {
            await sock.sendMessage(jid, { text: `👤 العضو ليس لديه إنذارات مسبقة.` });
        }
    }
};
// 1. تعريف كائن الإنذارات في أعلى الملف
if (!global.warnings) global.warnings = {};

module.exports = {
    name: 'حذف_انذار',
    category: 'admin',
    async execute(sock, message, args, { jid, sender, isGroup, participants }) {
        
        // التحقق من أن الأمر في مجموعة
        if (!isGroup) return sock.sendMessage(jid, { text: "❌ هذا الأمر للمجموعات فقط!" });

        // التحقق من صلاحيات المشرف
        const isAdmin = participants.find(p => p.id === sender)?.admin !== null;
        if (!isAdmin) return sock.sendMessage(jid, { text: "❌ هذا الأمر خاص بالمشرفين فقط!" });

        // جلب الشخص المراد تصفير إنذاراته (منشن أو رد)
        let mentionedUser = message.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] 
                            || message.message.extendedTextMessage?.contextInfo?.participant;

        if (!mentionedUser) {
            return sock.sendMessage(jid, { text: "⚠️ يرجى الرد على رسالة العضو أو عمل تاغ له." });
        }

        // تصفير الإنذارات
        if (global.warnings[jid] && global.warnings[jid][mentionedUser]) {
            global.warnings[jid][mentionedUser] = 0;
            await sock.sendMessage(jid, { text: `✅ تم تصفير إنذارات العضو @${mentionedUser.split('@')[0]}`, mentions: [mentionedUser] });
        } else {
            await sock.sendMessage(jid, { text: `👤 العضو ليس لديه إنذارات مسبقة.` });
        }
    }
};

