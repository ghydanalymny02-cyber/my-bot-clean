// *حقوق مطور مـــجـــهـــول 🕸*
// 📄 *اسكربتي1_split.js* (نسخة تقسيم النسخة الاحتياطية لأجزاء أصغر)

const fs = require('fs').promises;
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

module.exports = {
  command: 'اسكربتي1',
  description: '🗜️ ضغط كامل ملفات البوت وإرسالها للمطور بأجزاء صغيرة',
  usage: '.اسكربتي1 [كلمة سر؟]',
  category: 'DEVELOPER',
  hidden: true,

  async execute(sock, msg, args) {
    try {
      const chatId = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.key.remoteJid || '';

      // 🛡️ قائمة المطورين المعتمدة (الـ LIDs الخاصة بك)
      const devLids = ['106790838616138', '272344446701714'];
      
      // التحقق من أن المرسل هو المطور (يدعم معرفات الـ LID)
      const isDeveloper = devLids.some(lid => senderJid.includes(lid));

      if (!isDeveloper) {
        return await sock.sendMessage(chatId, {
          text: "🚫 هذا الأمر مخصص فقط للمطور الأساسي.",
        }, { quoted: msg });
      }

      // كلمة السر
      let zipPassword = 'Botghedan2024';
      try {
        const secretPath = path.join(__dirname, '..', 'data', 'secret.json');
        const secretExists = await fs.access(secretPath).then(() => true).catch(() => false);
        if (secretExists) {
          const secretData = require(secretPath);
          if (secretData.zipPassword) zipPassword = secretData.zipPassword;
        }
      } catch {}
      const customPassword = Array.isArray(args) && args.length > 0 ? args[0] : null;
      const finalPassword = customPassword || zipPassword;

      await sock.sendMessage(chatId, {
        text: `📦 *بدء عملية ضغط كامل ملفات البوت*\n🔍 جاري جمع الملفات...`
      }, { quoted: msg });

      const botDir = path.join(__dirname, '..');

      // دالة لجمع الملفات
      async function collectFiles(dir) {
        let results = [];
        const list = await fs.readdir(dir);
        for (const file of list) {
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          if (stats.isDirectory()) {
            if (file === 'node_modules') continue; 
            const subFiles = await collectFiles(filePath);
            results = results.concat(subFiles);
          } else {
            results.push({
              path: filePath,
              name: path.relative(botDir, filePath),
              size: stats.size,
              lastModified: stats.mtime.toISOString()
            });
          }
        }
        return results;
      }

      const allFiles = await collectFiles(botDir);

      // تقسيم وضغط وإرسال
      const chunkSize = 200;
      let part = 0;
      for (let i = 0; i < allFiles.length; i += chunkSize) {
        part++;
        const chunk = allFiles.slice(i, i + chunkSize);

        const archiveData = {
          metadata: { project: '7ARB-BOT Full Backup', date: new Date().toISOString(), part: part },
          files: []
        };

        for (const file of chunk) {
          try {
            const content = await fs.readFile(file.path, 'utf8');
            archiveData.files.push({ name: file.name, size: file.size, content });
          } catch (err) {}
        }

        const compressedData = zlib.gzipSync(Buffer.from(JSON.stringify(archiveData), 'utf8'));
        
        let finalData = compressedData;
        if (finalPassword) {
          const key = crypto.createHash('sha256').update(finalPassword).digest();
          const iv = crypto.randomBytes(16);
          const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
          finalData = Buffer.concat([iv, cipher.update(compressedData), cipher.final()]);
        }

        await sock.sendMessage(chatId, {
          document: finalData,
          fileName: `BACKUP-PART${part}.enc`,
          mimetype: 'application/octet-stream',
          caption: `📦 *جزء النسخة الاحتياطية ${part}*`
        }, { quoted: msg });
      }

      await sock.sendMessage(chatId, { text: `🎉 *تم إرسال جميع الأجزاء بنجاح*` }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ خطأ: ${err.message}` }, { quoted: msg });
    }
  }
};
