const fs = require('fs');
const path = require('path');

module.exports = {
  command: ['حذف_بايظه'],
  description: 'حذف الملفات المعطلة في البوت - للمطورين فقط',
  category: 'المطور',
  
  async execute(sock, msg, args) {
    try {
      // المطورون المسموح لهم
      const DEVELOPERS = ['963996097873', '178817339498583'];
      
      // استخراج رقم المرسل
      const senderJid = msg.key.participant || msg.key.remoteJid;
      const senderNumber = senderJid.split('@')[0];
      
      // التحقق من المطور
      if (!DEVELOPERS.includes(senderNumber)) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🚫 هذا الأمر حصري للمطورين فقط'
        });
      }
      
      // إرسال رسالة البدء
      await sock.sendMessage(msg.key.remoteJid, {
        text: '🗑️ **جاري البحث عن الملفات البايظة...**\n⏳ يرجى الانتظار'
      });
      
      // البحث في مجلد plugins
      const pluginsPath = path.join(__dirname, '..', 'plugins');
      let brokenFiles = [];
      
      if (fs.existsSync(pluginsPath)) {
        const files = fs.readdirSync(pluginsPath)
          .filter(file => file.endsWith('.js'));
        
        console.log(`🔍 فحص ${files.length} ملف في plugins`);
        
        for (const file of files) {
          const filePath = path.join(pluginsPath, file);
          
          try {
            // قراءة الملف
            const content = fs.readFileSync(filePath, 'utf8');
            
            // التحقق إذا كان الملف بايظ
            if (isBrokenFile(content, file)) {
              brokenFiles.push({
                name: file,
                path: filePath,
                size: fs.statSync(filePath).size
              });
            }
          } catch (error) {
            // إذا فشل القراءة، الملف بايظ
            brokenFiles.push({
              name: file,
              path: filePath,
              error: error.message
            });
          }
        }
      }
      
      // إذا لم توجد ملفات بايظة
      if (brokenFiles.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '✅ **لا توجد ملفات بايظة**\n\n' +
                'جميع الملفات في مجلد plugins سليمة'
        });
      }
      
      // عرض الملفات البايظة
      let filesList = '';
      let totalSize = 0;
      
      for (const file of brokenFiles.slice(0, 10)) {
        const sizeKB = file.size ? (file.size / 1024).toFixed(2) + 'KB' : 'تالف';
        filesList += `• ${file.name} (${sizeKB})\n`;
        if (file.size) totalSize += file.size;
      }
      
      if (brokenFiles.length > 10) {
        filesList += `• ... و ${brokenFiles.length - 10} ملف آخر\n`;
      }
      
      // طلب التأكيد
      const confirmation = 
        `⚠️ **تم العثور على ${brokenFiles.length} ملف بايظ**\n\n` +
        `📁 **الموقع:** plugins/\n` +
        `💾 **الحجم الإجمالي:** ${(totalSize / 1024).toFixed(2)}KB\n\n` +
        `📋 **الملفات:**\n${filesList}\n` +
        `❓ **هل تريد حذف جميع هذه الملفات؟**\n` +
        `اكتب **"نعم"** للحذف أو **"لا"** للإلغاء`;
      
      await sock.sendMessage(msg.key.remoteJid, { text: confirmation });
      
      // الانتظار للتأكيد
      let confirmed = false;
      
      const listener = async (m) => {
        if (m.key.remoteJid === msg.key.remoteJid) {
          const response = m.message.conversation || 
                          m.message.extendedTextMessage?.text || '';
          
          if (response === 'نعم') {
            confirmed = true;
            sock.ev.off('messages.upsert', listener);
            
            // حذف الملفات
            await deleteBrokenFiles(brokenFiles, sock, msg.key.remoteJid, senderNumber);
            
          } else if (response === 'لا') {
            sock.ev.off('messages.upsert', listener);
            await sock.sendMessage(msg.key.remoteJid, {
              text: '❌ **تم الإلغاء**\nلم يتم حذف أي ملفات'
            });
          }
        }
      };
      
      sock.ev.on('messages.upsert', listener);
      
      // مهلة 30 ثانية
      setTimeout(async () => {
        if (!confirmed) {
          sock.ev.off('messages.upsert', listener);
          await sock.sendMessage(msg.key.remoteJid, {
            text: '⏱️ **انتهت المهلة**\nتم الإلغاء تلقائياً'
          });
        }
      }, 30000);
      
    } catch (error) {
      console.error("❌ خطأ في حذف_بايظه:", error);
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ **حدث خطأ**\n\n` +
              `🔧 ${error.message || 'غير معروف'}`
      });
    }
  }
};

// دالة التحقق من الملف البايظ
function isBrokenFile(content, fileName) {
  try {
    // إذا كان الملف فارغاً
    if (!content || content.trim() === '') {
      return true;
    }
    
    // إذا كان حجم الملف أقل من 50 بايت (شبه فارغ)
    if (content.length < 50) {
      return true;
    }
    
    // إذا كان لا يحتوي على module.exports
    if (!content.includes('module.exports')) {
      return true;
    }
    
    // إذا كان يحتوي على أخطاء شائعة
    const commonErrors = [
      'SyntaxError',
      'TypeError',
      'ReferenceError',
      'Cannot read',
      'undefined',
      'null',
      'NaN'
    ];
    
    for (const error of commonErrors) {
      if (content.includes(error)) {
        return true;
      }
    }
    
    // إذا كان لا يحتوي على دالة execute
    if (!content.includes('execute') && !content.includes('async')) {
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error(`❌ خطأ في فحص ${fileName}:`, error);
    return true;
  }
}

// دالة حذف الملفات
async function deleteBrokenFiles(files, sock, chatId, senderNumber) {
  try {
    let deleted = 0;
    let failed = 0;
    
    // إرسال رسالة البدء
    await sock.sendMessage(chatId, {
      text: `🗑️ **جاري حذف ${files.length} ملف...**\n⏳ قد يستغرق بضع ثواني`
    });
    
    // حذف كل ملف
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        deleted++;
        console.log(`✅ حذف: ${file.name}`);
        
      } catch (error) {
        failed++;
        console.error(`❌ فشل حذف ${file.name}:`, error.message);
      }
    }
    
    // إرسال التقرير
    const report = 
      `✅ **تم الانتهاء من الحذف**\n\n` +
      `📊 **النتائج:**\n` +
      `├─ ✅ تم الحذف: ${deleted} ملف\n` +
      `├─ ❌ فشل الحذف: ${failed} ملف\n` +
      `└─ 📁 المجموع: ${files.length} ملف\n\n` +
      `💡 **نصائح:**\n` +
      `• استخدم \`.بينج\` لفحص البوت\n` +
      `• استخدم \`.إعادة\` لإعادة التشغيل\n` +
      `• تحقق من عمل الأوامر المتبقية\n\n` +
      `👤 ${senderNumber}\n` +
      `🕐 ${new Date().toLocaleTimeString('ar-SA')}`;
    
    await sock.sendMessage(chatId, { text: report });
    
    // إذا كانت هناك إخفاقات
    if (failed > 0) {
      setTimeout(async () => {
        await sock.sendMessage(chatId, {
          text: `⚠️ **بعض الملفات لم تحذف**\n` +
                `قد تكون محمية أو قيد الاستخدام`
        });
      }, 1000);
    }
    
  } catch (error) {
    console.error("❌ خطأ في حذف الملفات:", error);
    
    await sock.sendMessage(chatId, {
      text: `❌ **فشل عملية الحذف**\n\n` +
            `🔧 ${error.message}`
    });
  }
}