const fs = require('fs');
const path = require('path');

// مكان حفظ الرموز الممنوعة (بملف خارجي)
const bannedFile = path.join(__dirname, '../data/banedCodes.json');

// تأكد من وجود ملف الرموز
if (!fs.existsSync(bannedFile)) {
  fs.writeFileSync(bannedFile, JSON.stringify([]));
}

// 👑 قائمة النخبة والمطورين المسموح لهم فقط باستخدام الأمر
// ضع هنا أرقام الأشخاص الذين تريدهم (بدون مفتاح + أو علامات)
const eliteUsers = [
  '967715677073', // رقمك (المطور)
  '967700821174', // المطور الثاني
  '9677xxxxxxxx', // يمكنك إضافة رقم شخص ثالث من النخبة هنا
  '9677yyyyyyyy'  // ورقم رابع هنا.. وهكذا
];

function loadBanned() {
  return JSON.parse(fs.readFileSync(bannedFile));
}

function saveBanned(codes) {
  fs.writeFileSync(bannedFile, JSON.stringify(codes, null, 2));
}

module.exports = {
  command: 'منع',
  description: '🚫 منع رمز دولي من دخول المجموعة (أمر خاص بالنخبة فقط)',
  usage: '.منع +963',
  category: 'ELITE',

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderId = sender.split('@')[0]; // استخراج الرقم بدون @s.whatsapp.net

    // 🔒 الفحص الصارم: إذا لم يكن الرقم موجوداً في قائمة النخبة، يتم رفض الأمر فوراً
    if (!eliteUsers.includes(senderId)) {
      return sock.sendMessage(jid, {
        text: '👑 هذا الأمر حصري ومخصص لنخبة المطورين فقط! لا تمتلك الصلاحية لاستخدامه.',
      }, { quoted: msg });
    }

    // إذا كان من النخبة، يكمل الكود عمله طبيعي:
    const text = msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.body || '';
    const match = text.match(/\.?منع\s+(\+\d+)/i);
    if (!match) {
      return sock.sendMessage(jid, {
        text: '❌ يرجى كتابة الرمز بشكل صحيح. مثال:\n\n.منع +963',
      }, { quoted: msg });
    }

    const code = match[1];
    const banned = loadBanned();

    if (banned.includes(code)) {
      return sock.sendMessage(jid, {
        text: `⚠️ الرمز ${code} مضاف مسبقًا في قائمة المنع.`,
      }, { quoted: msg });
    }

    banned.push(code);
    saveBanned(banned);

    await sock.sendMessage(jid, {
      text: `✅ تم منع الرمز: ${code} بنجاح بأمر من النخبة.`,
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

module.exports = {
  command: 'روابط', 
  description: '🛡️ منع الروابط (حذف وطرد مباشر)',
  usage: 'يعمل تلقائياً في الخلفية',
  groupOnly: true,

  async execute(sock, msg) {
    const groupId = msg.key.remoteJid;
    
    // التأكد أن الرسالة داخل مجموعة
    if (!groupId.endsWith('@g.us')) return;

    const text = msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.body || '';
    const linkRegex = /https?:\/\/[^\s]+/gi;

    // الفحص التلقائي للروابط
    if (linkRegex.test(text)) {
      try {
        const metadata = await sock.groupMetadata(groupId);
        const senderId = msg.participant || msg.key.participant || msg.key.remoteJid;

        // 1. التحقق هل مرسل الرابط مشرف؟ (المشرفين مسموح لهم بنشر الروابط)
        const isAdmin = metadata.participants.some(
          p => p.id === senderId && (p.admin === 'admin' || p.admin === 'superadmin')
        );
        if (isAdmin) return; 

        // 2. التحقق هل البوت مشرف ليتمكن من الحذف والطرد؟
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const botIsAdmin = metadata.participants.some(
          p => p.id === botId && (p.admin === 'admin' || p.admin === 'superadmin')
        );

        if (!botIsAdmin) return; // إذا البوت ليس مشرفاً يتوقف لعدم امتلاك الصلاحيات

        // الإجراء الأول: حذف رسالة الرابط فوراً
        await sock.sendMessage(groupId, { delete: msg.key });

        const targetTag = senderId.split('@')[0];

        // الإجراء الثاني: إرسال رسالة الطرد
        await sock.sendMessage(groupId, { 
          text: `🚷 تم طرد العضو @${targetTag} مباشرة بسبب مخالفة القوانين ونشر الروابط.`, 
          mentions: [senderId] 
        });
        
        // الإجراء الثالث: طرد العضو نهائياً من المجموعة
        await sock.groupParticipantsUpdate(groupId, [senderId], "remove");

      } catch (error) {
        console.error("🚨 خطأ في نظام الحذف والطرد المباشر للروابط:", error);
      }
    }
  }
};
