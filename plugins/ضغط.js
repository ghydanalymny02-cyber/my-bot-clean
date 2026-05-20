// *حقوق مطور يوميلا 🛡*
// 📄 *ضغط.js*

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { extractPureNumber } = require('../haykala/elite.js');

const archiveName = '7ARB-BOT.zip';
const zipFilePath = path.join(process.cwd(), archiveName);
const botFolderPath = process.cwd();
const { zipPassword } = require(path.join(__dirname, '..', 'data', 'secret.json'));

const devNumbers = ['963996097873', '178817339498583'];

module.exports = {
  command: 'ضغط',
  description: '🗜️ ضغط سكربت البوت (zip) بكلمة سر للمطور فقط',
  usage: '.ضغط',
  category: 'DEVELOPER',
  hidden: false,

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.key.remoteJid;
      const senderNumber = extractPureNumber(senderJid);

      if (!devNumbers.includes(senderNumber)) {
        return await sock.sendMessage(chatId, {
          text: "🚫 هذا الأمر مخصص فقط للمطور.",
        }, { quoted: msg });
      }

      await sock.sendMessage(chatId, {
        text: `📦 جاري ضغط السكربت إلى ملف .zip محمي بكلمة سر...\n🛡️ يتم استثناء:\n- ملف_الاتصال\n- ملحوظه\n- trash\n- secret\n- node_modules\n- test\n- تست\n- 3dd.json`,
      }, { quoted: msg });

      // أمر zip مع كلمة سر واستثناء الملفات
      const zipCommand = `zip -r -P ${zipPassword} "${archiveName}" * ` +
        `-x "ملف_الاتصال" "ملحوظه" "trash" "secret" "node_modules/*" "test/*" "تست/*" "3dd.json"`;

      exec(zipCommand, { cwd: botFolderPath, maxBuffer: 1024 * 1024 * 500 }, async (error, stdout, stderr) => {
        if (error) {
          return await sock.sendMessage(chatId, {
            text: `❌ فشل في ضغط الملفات:\n${error.message || stderr}`,
          }, { quoted: msg });
        }

        if (!fs.existsSync(zipFilePath)) {
          return await sock.sendMessage(chatId, {
            text: `❌ لم يتم إنشاء الملف.`,
          }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
          document: fs.readFileSync(zipFilePath),
          mimetype: 'application/zip',
          fileName: archiveName,
        }, { quoted: msg });

        fs.unlinkSync(zipFilePath);
        await sock.sendMessage(chatId, {
          text: `✅ تم إرسال السكربت بنجاح بصيغة .zip وتم حذفه من التخزين.`,
        }, { quoted: msg });
      });

    } catch (err) {
      console.error('❌ خطأ في أمر ضغط:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ فشل:\n${err.message || err.toString()}`,
      }, { quoted: msg });
    }
  }
};