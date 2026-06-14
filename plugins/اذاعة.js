module.exports = {
  command: ['اذاعة'],
  description: 'إرسال رسالة لجميع مجموعات البوت - للمطورين فقط',
  category: 'المطور',
  
  async execute(sock, msg, args) {
    try {
      // المطورون المسموح لهم
      const DEVELOPERS = ['967715677073', '967701227385'];
      
      // استخراج رقم المرسل
      const senderJid = msg.key.participant || msg.key.remoteJid;
      const senderNumber = senderJid.split('@')[0];
      
      // التحقق من المطور
      if (!DEVELOPERS.includes(senderNumber)) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🚫 هذا الأمر حصري للمطورين فقط'
        });
      }
      
      // التحقق من وجود args
      let messageText = '';
      if (args && Array.isArray(args)) {
        messageText = args.join(' ');
      }
      
      if (!messageText.trim()) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '📝 **طريقة الاستخدام:**\n\n' +
                '.اذاعة [نص الرسالة]\n\n' +
                '**أمثلة:**\n' +
                '.اذاعة مرحبا بالجميع 👋\n' +
                '.اذاعة هناك تحديث جديد للبوت 🔥\n\n' +
                '⚠️ سيتم إرسال الرسالة لجميع مجموعات البوت'
        });
      }
      
      // إرسال طلب التأكيد
      await sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ **تحذير:** هذا الأمر سيرسل الرسالة لجميع مجموعات البوت!\n\n` +
              `📝 **الرسالة:**\n${messageText.substring(0, 100)}${messageText.length > 100 ? '...' : ''}\n\n` +
              '❓ **هل أنت متأكد؟**\n' +
              'اكتب **"نعم"** للمواصلة'
      });
      
      // تسجيل طلب الإذاعة
      console.log(`📢 ${senderNumber} طلب إذاعة: ${messageText.substring(0, 50)}...`);
      
      // تنفيذ الإذاعة مباشرة (بدون انتظار تأكيد)
      await startBroadcast(sock, messageText, senderNumber);
      
    } catch (error) {
      console.error("❌ خطأ في أمر إذاعة:", error);
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ **حدث خطأ**\n\n` +
              `🔧 ${error.message || 'غير معروف'}`
      });
    }
  }
};

// دالة تنفيذ الإذاعة
async function startBroadcast(sock, messageText, senderNumber) {
  const startTime = Date.now();
  const senderJid = `${senderNumber}@s.whatsapp.net`;
  
  try {
    // إرسال رسالة البدء
    await sock.sendMessage(senderJid, {
      text: '🚀 **بدء عملية الإذاعة...**\n' +
            '⏳ جاري الإرسال...'
    });
    
    // بناء الرسالة
    const broadcastMessage = 
      `📢 *إذاعة من مطور البوت*\n\n` +
      `${messageText}\n\n` +
      `⚡ *مـــجـــهـــول بوت*\n` +
      `📅 ${new Date().toLocaleDateString('ar-SA')}`;
    
    // قائمة المجموعات التجريبية
    // أضف هنا معرفات مجموعاتك الحقيقية
    const groupsToBroadcast = [
      // مثال: '123456789123456789@g.us',
      // '987654321987654321@g.us',
      // '555555555555555555@g.us'
    ];
    
    // إذا لم توجد مجموعات محددة
    if (groupsToBroadcast.length === 0) {
      await sock.sendMessage(senderJid, {
        text: 'ℹ️ **لم يتم العثور على مجموعات**\n\n' +
              'يجب إضافة معرفات المجموعات في الكود.\n\n' +
              '🔧 **لإضافة مجموعات:**\n' +
              '1. افتح ملف اذاعة.js\n' +
              '2. ابحث عن `groupsToBroadcast`\n' +
              '3. أضف معرفات مجموعاتك\n' +
              'مثال:\n' +
              '```javascript\n' +
              'const groupsToBroadcast = [\n' +
              '  "123456789123456@g.us",\n' +
              '  "987654321987654@g.us"\n' +
              '];\n' +
              '```'
      });
      return;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    // إرسال للجميع
    for (let i = 0; i < groupsToBroadcast.length; i++) {
      const groupId = groupsToBroadcast[i];
      
      try {
        await sock.sendMessage(groupId, {
          text: broadcastMessage
        });
        
        successCount++;
        console.log(`✅ أرسلت لمجموعة ${i+1}: ${groupId}`);
        
        // تأخير لتجنب الحظر
        if (i < groupsToBroadcast.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        failCount++;
        console.error(`❌ فشل إرسال لمجموعة ${groupId}:`, error.message);
      }
    }
    
    // حساب وقت التنفيذ
    const executionTime = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // إرسال تقرير النتائج
    const report = 
      `✅ **تم الانتهاء من الإذاعة**\n\n` +
      `📊 **الإحصائيات:**\n` +
      `├─ ✅ نجح: ${successCount}\n` +
      `├─ ❌ فشل: ${failCount}\n` +
      `├─ 📊 المجموع: ${groupsToBroadcast.length}\n` +
      `└─ ⏱️ الوقت: ${executionTime}ثانية\n\n` +
      `📝 **الرسالة:**\n${messageText.substring(0, 150)}${messageText.length > 150 ? '...' : ''}\n\n` +
      `👨‍💻 ${senderNumber}\n` +
      `🕐 ${new Date().toLocaleTimeString('ar-SA')}`;
    
    await sock.sendMessage(senderJid, {
      text: report
    });
    
  } catch (error) {
    console.error("❌ خطأ في الإذاعة:", error);
    
    await sock.sendMessage(senderJid, {
      text: `❌ **فشل الإذاعة**\n\n` +
            `🔧 ${error.message || 'خطأ غير معروف'}\n` +
            `🔄 جاري إعادة المحاولة...`
    });
  }
}