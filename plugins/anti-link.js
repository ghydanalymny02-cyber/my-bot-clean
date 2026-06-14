const fs = require('fs');
const path = require('path');

// مسار حفظ الإنذارات والروابط
const warnsFile = path.join(__dirname, '../data/warns.json');
const settingsFile = path.join(__dirname, '../data/antilink.json');

// التأكد من وجود المجلد والملفات
const dataDir = path.dirname(warnsFile);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(warnsFile)) fs.writeFileSync(warnsFile, '{}');
if (!fs.existsSync(settingsFile)) fs.writeFileSync(settingsFile, '{}');

function loadData(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch {
    return {};
  }
}

function saveData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  command: 'حماية', // اسم الأمر
  description: '🔒 تفعيل أو إيقاف حماية المجموعات من الروابط وطرد المخالفين',
  usage: '.حماية روابط تشغيل / .حماية روابط ايقاف',
  category: 'admin',

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    let rawSender = msg.key.participant || msg.key.remoteJid || '';

    // 1. التأكد أن الأمر داخل مجموعة
    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: "❌ هذا الأمر يعمل داخل المجموعات فقط!" }, { quoted: msg });
    }

    try {
      const metadata = await sock.groupMetadata(from);
      const participants = metadata.participants;

      // 2. التحقق من صلاحيات المشرف للمرسل
      const isAdmin = participants.find(p => p.id === rawSender)?.admin !== null;
      if (!isAdmin) {
        return sock.sendMessage(from, { text: "❌ هذا الأمر خاص بمشرفي المجموعة فقط!" }, { quoted: msg });
      }

      // 3. معالجة تشغيل وإيقاف الأمر
      const action = args[0]?.toLowerCase();
      const settings = loadData(settingsFile);

      if (action === 'روابط' || action === 'الروابط') {
        const subAction = args[1];
        if (subAction === 'تشغيل' || subAction === 'on') {
          settings[from] = true;
          saveData(settingsFile, settings);
          return sock.sendMessage(from, { text: "✅ تم تفعيل نظام الحماية من الروابط بنجاح في هذه المجموعة." }, { quoted: msg });
        } else if (subAction === 'ايقاف' || subAction === 'off') {
          settings[from] = false;
          saveData(settingsFile, settings);
          return sock.sendMessage(from, { text: "⚠️ تم إيقاف نظام الحماية من الروابط." }, { quoted: msg });
        } else {
          return sock.sendMessage(from, { text: "💡 الاستخدام الصحيح:\n.حماية روابط تشغيل\n.حماية روابط ايقاف" }, { quoted: msg });
        }
      }

      // =========================================================
      // 🔥 الجزء التلقائي لفحص الرسائل (يعمل مع كل رسالة بالمجموعة)
      // =========================================================
      const settingsCheck = loadData(settingsFile);
      if (!settingsCheck[from]) return; // إذا كانت الحماية موقوفة يتجاهل الرسالة

      const text = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
      const linkRegex = /https?:\/\/[^\s]+/gi;

      if (linkRegex.test(text)) {
        // إذا كان مرسل الرابط مشرفاً نترك الرسالة ولا نحذفها
        const isSenderAdmin = participants.find(p => p.id === rawSender)?.admin !== null;
        if (isSenderAdmin) return;

        // التحقق هل البوت مشرف لاتخاذ الإجراء
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const botIsAdmin = participants.find(p => p.id === botId)?.admin !== null;
        if (!botIsAdmin) return;

        // حذف الرابط فوراً
        await sock.sendMessage(from, { delete: msg.key });

        // إدارة نظام الإنذارات الموحد
        const warns = loadData(warnsFile);
        if (!warns[from]) warns[from] = {};
        if (!warns[from][rawSender]) warns[from][rawSender] = 0;

        warns[from][rawSender] += 1;
        const currentWarns = warns[from][rawSender];
        saveData(warnsFile, warns);

        const targetTag = rawSender.split('@')[0];

        if (currentWarns >= 3) {
          // الطرد عند الإنذار الثالث
          await sock.sendMessage(from, { 
            text: `⚠️ العضو @${targetTag} تم طردك لتجاوزك حد الإنذارات (3/3) بسبب نشر الروابط.`, 
            mentions: [rawSender] 
          });
          await sock.groupParticipantsUpdate(from, [rawSender], "remove");
          
          warns[from][rawSender] = 0;
          saveData(warnsFile, warns);
        } else {
          // إنذار وتنبيه
          await sock.sendMessage(from, { 
            text: `🚫 ممنوع إرسال الروابط! @${targetTag} تم إضافة إنذار لحسابك، لديك الآن (${currentWarns}/3) إنذارات. عند الثالث يتم طردك تلقائياً.`, 
            mentions: [rawSender] 
          });
        }
      }

    } catch (error) {
      console.log("خطأ في نظام حماية الروابط:", error);
    }
  }
};

