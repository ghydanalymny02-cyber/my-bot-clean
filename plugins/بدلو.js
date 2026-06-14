// ╔════════════════════════════╗
// 👑 حقوق مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡
// ☠️ Aeren Yeager – Demon King
// ╚════════════════════════════╝

// ╔════════════════════════════╗
// ☠️ Aeren Yeager – Demon King
// ╚════════════════════════════╝

const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
  command: 'بدلو',
  description: 'يبدل نص معين في جميع كودات البلوجنز',
  category: '⊰𝑩𝑶𝑻 مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹//⊰',

  async execute(sock, msg) {
    try {
      const groupJid = msg.key.remoteJid;
      const sender = decode(msg.key.participant || groupJid);
      const senderLid = sender.split('@')[0];

      // ✅ تحقق من صلاحية النخبة
      if (!eliteNumbers.includes(senderLid)) {
        return await sock.sendMessage(groupJid, { text: '❗ لا تملك صلاحية استخدام هذا الأمر.' }, { quoted: msg });
      }

      // استخراج النص من الرسالة
      let rawText = msg.body || msg.message?.conversation || "";
      let command = this.command;

      // 🛠️ شيل الكوماند (.بدلو) من الأول وخلي النص اللي بعده بس
      let text = rawText.replace(new RegExp(`^\\.?${command}\\s*`, 'i'), '').trim();

      console.log(`📌 تم استقبال الأمر: ${command} | نص بعد التنضيف: ${text}`);

      if (!text || !text.includes('|')) {
        await sock.sendMessage(groupJid, { text: '❌ الصيغة خطأ. استعمل: .بدلو الكلمة القديمة|الكلمة الجديدة' }, { quoted: msg });
        return;
      }

      const [oldText, newText] = text.split('|').map(s => s.trim());

      if (!oldText || !newText) {
        await sock.sendMessage(groupJid, { text: '❌ تأكد أنك كتبت الكلمتين بشكل صحيح مفصولتين بـ |' }, { quoted: msg });
        return;
      }

      const pluginsDir = path.join(__dirname, '../plugins');
      let changedFiles = [];

      const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));

      for (let file of files) {
        const filePath = path.join(pluginsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        if (content.includes(oldText)) {
          let updatedContent = content.split(oldText).join(newText);
          fs.writeFileSync(filePath, updatedContent, 'utf8');
          changedFiles.push(file);
          console.log(`✅ تم التبديل في: ${file}`);
        }
      }

      if (changedFiles.length === 0) {
        await sock.sendMessage(groupJid, { text: `ℹ️ لم يتم العثور على "${oldText}" في أي ملف.` }, { quoted: msg });
      } else {
        await sock.sendMessage(groupJid, { text: `✅ تم التبديل في الملفات:\n${changedFiles.join('\n')}` }, { quoted: msg });
      }

    } catch (err) {
      console.error('❌ خطأ أثناء التبديل:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ حدث خطأ أثناء التبديل.' }, { quoted: msg });
    }
  }
};