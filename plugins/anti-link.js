const fs = require('fs');
const path = require('path');

// نفس مسار الملف المستخدم في أمر المسح الخاص بك تماماً لضمان الدمج 100%
const warnsFile = path.join(__dirname, '../data/warns.json');

function loadWarns() {
  try {
    if (!fs.existsSync(warnsFile)) fs.writeFileSync(warnsFile, '{}');
    const data = fs.readFileSync(warnsFile);
    return JSON.parse(data.length ? data : '{}');
  } catch {
    fs.writeFileSync(warnsFile, '{}');
    return {};
  }
}

function saveWarns(warns) {
  fs.writeFileSync(warnsFile, JSON.stringify(warns, null, 2));
}

module.exports = {
  // كود التفتيش والمراقبة التلقائية للروابط (يعمل تلقائياً بدون حاجة لأمر)
  async execute(sock, msg) {
    const groupId = msg.key.remoteJid;
    
    // التأكد أن الرسالة داخل مجموعة
    if (!groupId.endsWith('@g.us')) return;

    const text = msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.body || '';
    const linkRegex = /https?:\/\/[^\s]+/gi;

    // إذا احتوت الرسالة على رابط، يبدأ التعامل النخبوي معها
    if (linkRegex.test(text)) {
      try {
        const metadata = await sock.groupMetadata(groupId);
        const senderId = msg.participant || msg.key.participant || msg.key.remoteJid;

        // التحقق هل مرسل الرابط مشرف؟ (حتى لا يتم معاقبة المشرفين)
        const isAdmin = metadata.participants.some(
          p => p.id === senderId && (p.admin === 'admin' || p.admin === 'superadmin')
        );
        if (isAdmin) return; 

        // التحقق هل البوت مشرف ليتمكن من اتخاذ الإجراء الأمني؟
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const botIsAdmin = metadata.participants.some(
          p => p.id === botId && (p.admin === 'admin' || p.admin === 'superadmin')
        );

        if (!botIsAdmin) return; // إذا كان البوت ليس مشرفاً يتوقف لعدم امتلاك الصلاحيات

        // 1. حذف رسالة الرابط فوراً لحماية المجموعة
        await sock.sendMessage(groupId, { delete: msg.key });

        // 2. تحميل قاعدة إنذارات البوت الموحدة والتعديل عليها
        const warns = loadWarns();

        if (!warns[groupId]) warns[groupId] = {};
        if (!warns[groupId][senderId]) warns[groupId][senderId] = 0;

        // زيادة عداد الإنذار (سيظهر في أمر المسح والإنذار اليدوي الخاص بك)
        warns[groupId][senderId] += 1;
        const currentWarns = warns[groupId][senderId];
        saveWarns(warns);

        const targetTag = senderId.split('@')[0];

        if (currentWarns >= 3) {
          // الطرد الحتمي عند الوصول لـ 3 إنذارات موحدة
          await sock.sendMessage(groupId, { 
            text: `⚠️ العضو @${targetTag} تم طردك لتجاوزك حد الإنذارات الإجمالي (3/3) بسبب نشر الروابط.`, 
            mentions: [senderId] 
          });
          
          await sock.groupParticipantsUpdate(groupId, [senderId], "remove");
          
          // تصفير عداد إنذاراته بعد الطرد حتى لا يعود محظوراً إذا دخل مجدداً
          warns[groupId][senderId] = 0;
          saveWarns(warns);
        } else {
          // التنبيه العادي بالإنذار المشترك
          await sock.sendMessage(groupId, { 
            text: `🚫 ممنوع إرسال الروابط! @${targetTag} تم إضافة إنذار لعدّادك العام، لديك الآن (${currentWarns}/3) إنذارات. عند الثالث يتم الطرد.`, 
            mentions: [senderId] 
          }, { quoted: msg });
        }

      } catch (error) {
        console.error("🚨 خطأ في دمج نظام إنذارات الروابط الموحد:", error);
      }
    }
  }
};
