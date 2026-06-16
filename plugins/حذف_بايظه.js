const fs = require('fs');
const path = require('path');

module.exports = {
  command: ['حذف_بايظه'],
  description: 'حذف الملفات المعطلة في البوت - للمطورين فقط',
  category: 'المطور',
  
  async execute(sock, msg, args) {
    try {
      // المطورون المسموح لهم (يدعم الـ LID)
      const DEVELOPERS = ['272344446701714', '106790838616138'];
      
      // استخراج معرف المرسل
      const senderJid = msg.key.participant || msg.key.remoteJid || '';
      
      // التحقق من الصلاحية باستخدام .some() للتعامل مع الـ LID
      const isDeveloper = DEVELOPERS.some(dev => senderJid.includes(dev));
      
      if (!isDeveloper) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🚫 هذا الأمر حصري للمطورين فقط'
        }, { quoted: msg });
      }
      
      // إرسال رسالة البدء
      await sock.sendMessage(msg.key.remoteJid, {
        text: '🗑️ **جاري البحث عن الملفات البايظة...**\n⏳ يرجى الانتظار'
      }, { quoted: msg });
      
      // البحث في مجلد plugins
      const pluginsPath = path.join(__dirname, '..', 'plugins');
      let brokenFiles = [];
      
      if (fs.existsSync(pluginsPath)) {
        const files = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));
        
        for (const file of files) {
          const filePath = path.join(pluginsPath, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            if (isBrokenFile(content, file)) {
              brokenFiles.push({ name: file, path: filePath, size: fs.statSync(filePath).size });
            }
          } catch (error) {
            brokenFiles.push({ name: file, path: filePath, error: error.message });
          }
        }
      }
      
      if (brokenFiles.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '✅ **لا توجد ملفات بايظة**\nجميع الملفات في مجلد plugins سليمة.'
        }, { quoted: msg });
      }
      
      let filesList = brokenFiles.slice(0, 10).map(f => `• ${f.name}`).join('\n');
      const confirmation = 
        `⚠️ **تم العثور على ${brokenFiles.length} ملف بايظ**\n\n` +
        `📋 **الملفات:**\n${filesList}\n` +
        (brokenFiles.length > 10 ? `\n• ... و ${brokenFiles.length - 10} ملف آخر\n` : '') +
        `\n❓ **هل تريد حذف جميع هذه الملفات؟**\nاكتب **"نعم"** للحذف أو **"لا"** للإلغاء`;
      
      await sock.sendMessage(msg.key.remoteJid, { text: confirmation }, { quoted: msg });
      
      // مستمع للرد
      const listener = async (msgUpdate) => {
        const m = msgUpdate.messages[0];
        if (m.key.remoteJid !== msg.key.remoteJid) return;
        const response = (m.message?.conversation || m.message?.extendedTextMessage?.text || '').trim();
        
        if (response === 'نعم') {
          sock.ev.off('messages.upsert', listener);
          await deleteBrokenFiles(brokenFiles, sock, msg.key.remoteJid);
        } else if (response === 'لا') {
          sock.ev.off('messages.upsert', listener);
          await sock.sendMessage(msg.key.remoteJid, { text: '❌ **تم الإلغاء**' }, { quoted: m });
        }
      };
      
      sock.ev.on('messages.upsert', listener);
      setTimeout(() => sock.ev.off('messages.upsert', listener), 30000);
      
    } catch (error) {
      console.error("❌ خطأ:", error);
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ حدث خطأ: ${error.message}` });
    }
  }
};

// الدالة المساعدة للفحص (تم الإبقاء عليها كما هي)
function isBrokenFile(content, fileName) {
  if (!content || content.trim().length < 50) return true;
  if (!content.includes('module.exports')) return true;
  const commonErrors = ['SyntaxError', 'TypeError', 'ReferenceError', 'undefined', 'null'];
  return commonErrors.some(err => content.includes(err));
}

// الدالة المساعدة للحذف
async function deleteBrokenFiles(files, sock, chatId) {
  let deleted = 0;
  for (const file of files) {
    try {
      fs.unlinkSync(file.path);
      deleted++;
    } catch (e) {}
  }
  await sock.sendMessage(chatId, { text: `✅ **تم حذف ${deleted} ملف بنجاح.**` });
}
