const fs = require('fs').promises;
const path = require('path');

module.exports = {
  command: 'ارسال_للكل',
  description: 'إرسال رسالة لجميع المجموعات (للمطور فقط)',
  category: 'DEVELOPER',
  hidden: true,
  
  async execute(sock, msg, args) {
    // قائمة المطورين المعتمدة (أرقام + LIDs)
    const devIds = ['963996097873', '967701227385', '272344446701714', '106790838616138'];
    
    // استخراج معرف المرسل الكامل للتحقق
    const senderJid = msg.key.participant || msg.key.remoteJid || '';
    
    // التحقق من الصلاحية: هل المعرف الخاص بك موجود ضمن قائمة المطورين؟
    const isAuthorized = devIds.some(id => senderJid.includes(id));
    
    if (!isAuthorized) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "🚫 هذا الأمر مخصص فقط للمطور."
      }, { quoted: msg });
    }
    
    if (!args || args.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ *الاستخدام:*\n.ارسال_للكل <الرسالة>"
      }, { quoted: msg });
    }
    
    const message = args.join(' ');
    const groupsFile = path.join(__dirname, '..', 'data', 'groups_list.json');
    
    // جلب المجموعات
    let groups = [];
    try {
      // محاولة الحصول على المجموعات من ذاكرة البوت (sock.chats)
      if (sock.chats) {
        groups = sock.chats.filter(chat => chat.id.endsWith('@g.us')).map(chat => chat.id);
      }
      
      // إذا كانت المصفوفة فارغة، نحاول القراءة من الملف
      if (groups.length === 0) {
        const data = await fs.readFile(groupsFile, 'utf8').catch(() => '[]');
        groups = JSON.parse(data);
      } else {
        // حفظ المجموعات الجديدة في الملف
        await fs.writeFile(groupsFile, JSON.stringify(groups, null, 2), 'utf8').catch(() => {});
      }
    } catch (error) {
      console.error("خطأ في جلب المجموعات:", error);
    }
    
    if (groups.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ لم يتم العثور على مجموعات نشطة"
      }, { quoted: msg });
    }
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `📤 *جاري الإرسال لـ ${groups.length} مجموعة...*`
    }, { quoted: msg });
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < groups.length; i++) {
      try {
        await sock.sendMessage(groups[i], {
          text: `📢 *إعلان من المطور:*\n\n${message}`
        });
        successCount++;
        // تأخير بسيط للحماية من الحظر
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        failCount++;
      }
    }
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `✅ *تم الانتهاء*\nنجح: ${successCount}\nفشل: ${failCount}`
    });
  }
};
