const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

module.exports = {
  command: ['باتش-اضافه'],
  description: '📦 إنشاء ملف جديد داخل مجلد الإضافات.',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNumber = sender.split('@')[0];

    if (!eliteNumbers.includes(senderNumber)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ هذا الأمر مخصص للنخبة فقط.',
      }, { quoted: msg });
    }

    const fullText =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '';

    const commandName = fullText.split(' ')[0]?.toLowerCase();
    const inputText = fullText.slice(commandName.length).trim();

    if (!inputText) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `❗ يرجى تحديد اسم الملف.\n📌 مثال:\n${commandName} example.js`,
      }, { quoted: msg });
    }

    let parts = inputText.split(' ');
    let filename = parts[0];
    let data = parts.slice(1).join(' ');

    // لو مفيش .js في الآخر نزودها
    if (!filename.endsWith('.js')) filename += '.js';

    const filePath = path.join('plugins', filename);

    if (fs.existsSync(filePath)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ الملف *${filename}* موجود بالفعل.\n❌ لن يتم الكتابة فوقه.`,
      }, { quoted: msg });
    }

    // لو مفيش محتوى مكتوب يدويًا، و فيه ريبلاي على رسالة فيها كود
    if (!data && msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;
      data =
        quoted.conversation ||
        quoted.extendedTextMessage?.text ||
        quoted.documentMessage?.caption ||
        '';
    }

    if (!data) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `❗ لم يتم العثور على كود صالح لإضافته.\nيرجى كتابة الكود بعد الاسم أو عمل ريبلاي لرسالة فيها الكود.`,
      }, { quoted: msg });
    }

    try {
      fs.writeFileSync(filePath, data, 'utf8');
      await sock.sendMessage(msg.key.remoteJid, {
        text: `✅ تم إنشاء الملف *${filename}* بنجاح في مجلد الإضافات.`,
      }, { quoted: msg });
    } catch (err) {
      console.error(err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ فشل في إنشاء الملف *${filename}*:\n${err.message}`,
      }, { quoted: msg });
    }
  },
};