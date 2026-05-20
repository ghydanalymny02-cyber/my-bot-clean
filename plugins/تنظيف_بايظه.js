const fs = require('fs');
const path = require('path');

module.exports = {
  command: ['تنظيف_بايظه'],
  description: 'فحص وحذف الأوامر المعطلة في البوت - للمطورين فقط',
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
        text: '🔍 **جاري فحص الأوامر المعطلة...**\n⏳ يرجى الانتظار'
      });
      
      // تعريف مجلدات الأوامر
      const pluginsPath = path.join(__dirname, '..', 'plugins');
      const commandsPath = path.join(__dirname, '..', 'commands');
      
      const commandDirs = [];
      
      // التحقق من وجود المجلدات
      if (fs.existsSync(pluginsPath)) commandDirs.push(pluginsPath);
      if (fs.existsSync(commandsPath)) commandDirs.push(commandsPath);
      
      if (commandDirs.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '📁 **لم يتم العثور على مجلدات الأوامر**\n\n' +
                'المجلدات المتوقعة:\n' +
                `• ${pluginsPath}\n` +
                `• ${commandsPath}`
        });
      }
      
      // جمع جميع ملفات الأوامر
      const allCommandFiles = [];
      for (const dir of commandDirs) {
        try {
          const files = fs.readdirSync(dir)
            .filter(file => file.endsWith('.js'))
            .map(file => path.join(dir, file));
          
          allCommandFiles.push(...files);
        } catch (dirError) {
          console.error(`❌ خطأ في قراءة مجلد ${dir}:`, dirError.message);
        }
      }
      
      if (allCommandFiles.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '📭 **لم يتم العثور على أي ملفات أوامر**\n\n' +
                'لا توجد ملفات أوامر للفحص'
        });
      }
      
      // فحص كل ملف
      const brokenFiles = [];
      const validFiles = [];
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: `🔧 **جاري فحص ${allCommandFiles.length} ملف...**`
      });
      
      for (const filePath of allCommandFiles) {
        try {
          const fileName = path.basename(filePath);
          
          // قراءة الملف
          const fileContent = fs.readFileSync(filePath, 'utf8');
          
          // التحقق من صحة الملف
          const isValid = await checkFileValidity(filePath, fileContent);
          
          if (!isValid) {
            brokenFiles.push({
              path: filePath,
              name: fileName,
              size: fs.statSync(filePath).size
            });
          } else {
            validFiles.push(fileName);
          }
          
        } catch (fileError) {
          console.error(`❌ خطأ في فحص الملف ${filePath}:`, fileError.message);
          brokenFiles.push({
            path: filePath,
            name: path.basename(filePath),
            error: fileError.message
          });
        }
      }
      
      // عرض النتائج
      if (brokenFiles.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: `✅ **جميع الأوامر سليمة**\n\n` +
                `📊 تم فحص ${allCommandFiles.length} ملف\n` +
                `✅ ${validFiles.length} ملف صالح\n` +
                `❌ 0 ملف معطل\n\n` +
                `⚡ **البوت يعمل بشكل مثالي**`
        });
      }
      
      // عرض الملفات المعطلة
      let brokenList = '';
      let totalSize = 0;
      
      for (const file of brokenFiles.slice(0, 10)) {
        brokenList += `• ${file.name} (${file.size ? (file.size / 1024).toFixed(2) + 'KB' : 'معطل'})\n`;
        if (file.size) totalSize += file.size;
      }
      
      if (brokenFiles.length > 10) {
        brokenList += `• ... و ${brokenFiles.length - 10} ملف آخر\n`;
      }
      
      // إرسال تقرير الملفات المعطلة
      const report = 
        `⚠️ **تم العثور على ${brokenFiles.length} ملف معطل**\n\n` +
        `📊 **الإحصائيات:**\n` +
        `├─ 📁 تم الفحص: ${allCommandFiles.length} ملف\n` +
        `├─ ✅ سليم: ${validFiles.length} ملف\n` +
        `├─ ❌ معطل: ${brokenFiles.length} ملف\n` +
        `└─ 💾 حجم المعطلة: ${(totalSize / 1024).toFixed(2)}KB\n\n` +
        `📋 **الملفات المعطلة:**\n${brokenList}\n` +
        `❓ **هل تريد حذف الملفات المعطلة؟**\n` +
        `اكتب **"حذف"** للمواصلة أو **"الغاء"** للإلغاء`;
      
      await sock.sendMessage(msg.key.remoteJid, { text: report });
      
      // الانتظار للتأكيد
      let confirmed = false;
      const timeout = 30000; // 30 ثانية
      
      const listener = async (m) => {
        if (m.key.remoteJid === msg.key.remoteJid && 
            (m.key.participant === senderJid || m.key.remoteJid === senderJid)) {
          
          const response = m.message.conversation || 
                          m.message.extendedTextMessage?.text || '';
          
          if (response === 'حذف') {
            confirmed = true;
            sock.ev.off('messages.upsert', listener);
            
            // حذف الملفات المعطلة
            await deleteBrokenFiles(brokenFiles, sock, msg.key.remoteJid, senderNumber);
            
          } else if (response === 'الغاء') {
            sock.ev.off('messages.upsert', listener);
            await sock.sendMessage(msg.key.remoteJid, {
              text: '❌ **تم الإلغاء**\nلم يتم حذف أي ملفات'
            });
          }
        }
      };
      
      sock.ev.on('messages.upsert', listener);
      
      // مهلة الانتظار
      setTimeout(async () => {
        if (!confirmed) {
          sock.ev.off('messages.upsert', listener);
          await sock.sendMessage(msg.key.remoteJid, {
            text: '⏱️ **انتهت المهلة**\nتم الإلغاء تلقائياً'
          });
        }
      }, timeout);
      
    } catch (error) {
      console.error("❌ خطأ في أمر تنظيف_بايظه:", error);
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ **حدث خطأ**\n\n` +
              `🔧 ${error.message || 'غير معروف'}`
      });
    }
  }
};

// دالة التحقق من صحة الملف
async function checkFileValidity(filePath, content) {
  try {
    // التحقق من الصيغة الأساسية
    if (!content || content.trim() === '') {
      return false; // ملف فارغ
    }
    
    // التحقق من وجود module.exports
    if (!content.includes('module.exports') && !content.includes('export default')) {
      return false; // ليس ملف أمر صالح
    }
    
    // التحقق من وجود الهيكل الأساسي
    const requiredKeywords = ['command', 'execute', 'description'];
    let foundCount = 0;
    
    for (const keyword of requiredKeywords) {
      if (content.includes(keyword)) foundCount++;
    }
    
    if (foundCount < 2) {
      return false; // لا يطابق هيكل الأمر
    }
    
    // محاولة تحميل الملف للتحقق من الأخطاء
    try {
      // حذف cache إذا كان الملف محملاً مسبقاً
      delete require.cache[require.resolve(filePath)];
      
      // محاولة التحميل
      const command = require(filePath);
      
      // التحقق من الهيكل
      if (!command || typeof command !== 'object') return false;
      if (!command.command || !Array.isArray(command.command)) return false;
      if (typeof command.execute !== 'function') return false;
      
      return true; // الملف سليم
      
    } catch (requireError) {
      console.error(`❌ خطأ في تحميل ${filePath}:`, requireError.message);
      return false; // خطأ في التحميل
    }
    
  } catch (error) {
    console.error(`❌ خطأ في فحص ${filePath}:`, error);
    return false;
  }
}

// دالة حذف الملفات المعطلة
async function deleteBrokenFiles(brokenFiles, sock, chatId, senderNumber) {
  try {
    let deletedCount = 0;
    let failedCount = 0;
    const failedDeletions = [];
    
    // إرسال رسالة البدء
    await sock.sendMessage(chatId, {
      text: '🗑️ **جاري حذف الملفات المعطلة...**\n⏳ يرجى الانتظار'
    });
    
    // حذف كل ملف
    for (const file of brokenFiles) {
      try {
        fs.unlinkSync(file.path);
        deletedCount++;
        console.log(`✅ حذف: ${file.name}`);
        
      } catch (deleteError) {
        failedCount++;
        failedDeletions.push(`${file.name}: ${deleteError.message}`);
        console.error(`❌ فشل حذف ${file.name}:`, deleteError.message);
      }
    }
    
    // إرسال التقرير النهائي
    const result = 
      `✅ **تم الانتهاء من التنظيف**\n\n` +
      `📊 **نتائج الحذف:**\n` +
      `├─ ✅ تم الحذف: ${deletedCount} ملف\n` +
      `├─ ❌ فشل الحذف: ${failedCount} ملف\n` +
      `└─ 📁 الإجمالي: ${brokenFiles.length} ملف\n\n` +
      `⚡ **تأثير على البوت:**\n` +
      `• الأوامر المحذوفة لن تعمل\n` +
      `• يفضل إعادة تشغيل البوت\n` +
      `• تحقق من الأوامر الجديدة\n\n` +
      `👨‍💻 ${senderNumber}\n` +
      `🕐 ${new Date().toLocaleTimeString('ar-SA')}`;
    
    await sock.sendMessage(chatId, { text: result });
    
    // إذا كانت هناك إخفاقات
    if (failedDeletions.length > 0) {
      await sock.sendMessage(chatId, {
        text: `⚠️ **الملفات التي فشل حذفها:**\n` +
              failedDeletions.slice(0, 5).map(f => `• ${f}`).join('\n') +
              (failedDeletions.length > 5 ? `\n... و ${failedDeletions.length - 5} أخرى` : '')
      });
    }
    
    // اقتراح إعادة التشغيل
    if (deletedCount > 0) {
      setTimeout(async () => {
        await sock.sendMessage(chatId, {
          text: '💡 **نصيحة:**\n' +
                'استخدم `.إعادة` لإعادة تشغيل البوت وتطبيق التغييرات'
        });
      }, 1000);
    }
    
  } catch (error) {
    console.error("❌ خطأ في حذف الملفات:", error);
    
    await sock.sendMessage(chatId, {
      text: `❌ **فشل عملية الحذف**\n\n` +
            `🔧 ${error.message || 'خطأ غير معروف'}`
    });
  }
}