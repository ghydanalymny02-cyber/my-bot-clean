const fs = require('fs').promises;
const path = require('path');

module.exports = {
  command: 'ارسال_للكل',
  description: 'إرسال رسالة لجميع المجموعات (للمطور فقط)',
  category: 'DEVELOPER',
  hidden: true,
  
  async execute(sock, msg, args) {
    const devNumbers = ['963996097873', '178817339498583'];
    const senderNumber = (msg.key.participant || msg.key.remoteJid).split('@')[0];
    
    if (!devNumbers.includes(senderNumber)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "🚫 هذا الأمر مخصص فقط للمطور."
      }, { quoted: msg });
    }
    
    if (!args || args.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ *الاستخدام:*\n.ارسال_للكل <الرسالة>\nمثال: .ارسال_للكل تحديث جديد للبوت 🚀"
      }, { quoted: msg });
    }
    
    const message = args.join(' ');
    const groupsFile = path.join(__dirname, '..', 'data', 'groups_list.json');
    
    // دالة لجلب جميع المجموعات
    async function getAllGroups() {
      try {
        const data = await fs.readFile(groupsFile, 'utf8');
        return JSON.parse(data);
      } catch (error) {
        // إذا لم يوجد ملف، نرجع قائمة فارغة
        return [];
      }
    }
    
    // جلب المجموعات من البوت
    let groups = [];
    try {
      // محاولة جلب المجموعات من ذاكرة البوت
      const groupChats = sock.chats.filter(chat => chat.id.endsWith('@g.us'));
      groups = groupChats.map(chat => chat.id);
      
      // حفظ في الملف للاستخدام المستقبلي
      await fs.writeFile(groupsFile, JSON.stringify(groups, null, 2), 'utf8');
    } catch (error) {
      // استخدام المجموعات المحفوظة
      groups = await getAllGroups();
    }
    
    if (groups.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ لم يتم العثور على أي مجموعات"
      }, { quoted: msg });
    }
    
    // إرسال تأكيد
    await sock.sendMessage(msg.key.remoteJid, {
      text: `📤 *بدء الإرسال الجماعي*\n\n` +
            `📝 الرسالة: ${message}\n` +
            `👥 عدد المجموعات: ${groups.length}\n` +
            `⏳ جاري الإرسال...`
    }, { quoted: msg });
    
    let successCount = 0;
    let failCount = 0;
    
    // إرسال الرسالة لكل مجموعة
    for (let i = 0; i < groups.length; i++) {
      const groupId = groups[i];
      
      try {
        // الحصول على اسم المجموعة
        let groupName = 'مجموعة';
        try {
          const metadata = await sock.groupMetadata(groupId);
          groupName = metadata.subject || groupName;
        } catch (e) {
          // تجاهل خطأ جلب الاسم
        }
        
        // إرسال الرسالة
        await sock.sendMessage(groupId, {
          text: `📢 *إعلان من المطور*\n\n${message}\n\n👨‍💻 المطور: ${senderNumber}\n📅 ${new Date().toLocaleDateString('ar-SA')}`
        });
        
        successCount++;
        
        // إرسال تحديث كل 10 مجموعات
        if ((i + 1) % 10 === 0) {
          await sock.sendMessage(msg.key.remoteJid, {
            text: `📊 *التقدم:*\n` +
                  `✅ تم الإرسال إلى: ${i + 1}/${groups.length} مجموعة\n` +
                  `🎯 النجاح: ${successCount}\n` +
                  `❌ الفشل: ${failCount}`
          });
        }
        
        // تأخير 2 ثانية بين كل رسالة لتجنب الحظر
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        failCount++;
        console.error(`❌ فشل إرسال إلى ${groupId}:`, error.message);
      }
    }
    
    // تقرير نهائي
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🎉 *اكتمل الإرسال الجماعي*\n\n` +
            `📊 *الإحصائيات:*\n` +
            `✅ نجح: ${successCount} مجموعة\n` +
            `❌ فشل: ${failCount} مجموعة\n` +
            `📝 الرسالة: ${message.substring(0, 50)}...\n\n` +
            `👨‍💻 تم الإرسال بواسطة: ${senderNumber}`
    });
  }
};