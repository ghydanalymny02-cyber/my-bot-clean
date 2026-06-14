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
      const senderJid = msg.key.participant || msg.key.remoteJid;

      // استخراج الرقم
      const extractPureNumber = (jid) => {
        if (!jid) return '';
        const match = jid.toString().match(/\d+/g);
        return match ? match.join('') : '';
      };
      const senderNumber = extractPureNumber(senderJid);

      // أرقام المطورين
      const devNumbers = ['967715677073', '967701227385'];
      let isDeveloper = devNumbers.some(devNum =>
        senderNumber.includes(devNum) || devNum.includes(senderNumber)
      );

      if (!isDeveloper) {
        return await sock.sendMessage(chatId, {
          text: "🚫 هذا الأمر مخصص فقط للمطور.",
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
        text: `📦 *بدء عملية ضغط كامل ملفات البوت*\n👨‍💻 المطور: ${senderNumber}\n🔍 جاري جمع الملفات...`
      }, { quoted: msg });

      const botDir = path.join(__dirname, '..');

      // دالة لجمع كل الملفات باستثناء node_modules
      async function collectFiles(dir) {
        let results = [];
        const list = await fs.readdir(dir);
        for (const file of list) {
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          if (stats.isDirectory()) {
            if (file === 'node_modules') continue; // تجاهل node_modules
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

      await sock.sendMessage(chatId, {
        text: `📊 **تم جمع الملفات:**\n📁 الإجمالي: ${allFiles.length} ملف\n⏳ جاري تقسيم وضغط الملفات...`
      }, { quoted: msg });

      // تقسيم الملفات إلى أجزاء (كل 200 ملف)
      const chunkSize = 200;
      let part = 0;
      for (let i = 0; i < allFiles.length; i += chunkSize) {
        part++;
        const chunk = allFiles.slice(i, i + chunkSize);

        const archiveData = {
          metadata: {
            project: '7ARB-BOT Full Backup',
            date: new Date().toISOString(),
            developer: senderNumber,
            totalFiles: chunk.length,
            backupType: 'bot-full-files',
            part: part
          },
          files: []
        };

        for (const file of chunk) {
          try {
            const content = await fs.readFile(file.path, 'utf8');
            archiveData.files.push({
              name: file.name,
              size: file.size,
              lastModified: file.lastModified,
              content
            });
          } catch (err) {
            archiveData.files.push({
              name: file.name,
              size: file.size,
              status: 'error',
              error: err.message
            });
          }
        }

        // ضغط البيانات
        const archiveJson = JSON.stringify(archiveData, null, 2);
        const compressedData = zlib.gzipSync(Buffer.from(archiveJson, 'utf8'));

        // تشفير إذا لزم
        let finalData = compressedData;
        if (finalPassword) {
          const key = crypto.createHash('sha256').update(finalPassword).digest();
          const iv = crypto.randomBytes(16);
          const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
          let encrypted = cipher.update(compressedData);
          encrypted = Buffer.concat([encrypted, cipher.final()]);
          finalData = Buffer.concat([iv, encrypted]);
        }

        const fileName = finalPassword ? 
          `BOT-BACKUP-PART${part}.enc` : 
          `BOT-BACKUP-PART${part}.json.gz`;

        await sock.sendMessage(chatId, {
          document: finalData,
          fileName,
          mimetype: 'application/octet-stream',
          caption: `📦 *نسخة احتياطية كاملة لملفات البوت*\n👨‍💻 المطور: ${senderNumber}\n📁 الملفات في هذا الجزء: ${chunk.length}\n🔢 الجزء: ${part}\n🔐 ${finalPassword ? '✅ مشفر' : '⚠️ غير مشفر'}`
        }, { quoted: msg });
      }

      await sock.sendMessage(chatId, {
        text: `🎉 *اكتملت العملية بنجاح*\n📤 تم إرسال النسخة الكاملة مقسمة إلى ${part} أجزاء`
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ خطأ غير متوقع: ${err.message}`
      }, { quoted: msg });
    }
  }
};