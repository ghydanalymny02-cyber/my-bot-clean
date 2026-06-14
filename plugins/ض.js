// *حقوق مطورة يوميلا  🕸*
// 📄 *ض.js* (جزء 1/1):

// *كود من عمو موزان موزان 🫦*
// 📄 *ض.js* (جزء 1/1):

// ╔══════════════════════════════════════╗
// 👑 نظام يوميلا | Demon Authority System
// 📄 ض.js – إنشاء البلجن بالسيطرة المطلقة
// 🩸 Yumila Kibutsuji – King of Demons
// ╚══════════════════════════════════════╝


const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js'); // 👑 نخبة يوميلا

module.exports = {
  command: ['ض'],
  description: '🩸 إنشاء بلجن جديد من كود مُشار إليه — خاص بنخبة يوميلا',
  category: 'mouzan',

  async execute(sock, msg, args = []) {
    const chatId = msg.key.remoteJid;
    const sender = msg.key.participant || chatId;
    const senderNumber = sender.split('@')[0];

    // 🛡️ قفل الأمر للنخبة فقط
    if (!eliteNumbers.includes(senderNumber)) {
      return await sock.sendMessage(chatId, {
        text: `╭─❌ *مرفوض*
│ هذا الأمر محجوز لنخبة يوميلا فقط
╰─🩸 السلطة لا تُمنح للضعفاء`,
      }, { quoted: msg });
    }

    // 📌 الرسالة المُشار إليها
    const quotedMessage =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quotedMessage || !quotedMessage.conversation) {
      return await sock.sendMessage(chatId, {
        text: `╭─⚠️ *خطأ في الطقوس*
│ قم بالرد على رسالة تحتوي على الكود
│ ثم اكتب الأمر 🩸
╰─👑 يوميلا يراقب`,
      }, { quoted: msg });
    }

    let pluginCode = quotedMessage.conversation.trim();

    if (!pluginCode) {
      return await sock.sendMessage(chatId, {
        text: `❌ الكود فارغ… حتى الشياطين ترفضه.`,
      }, { quoted: msg });
    }

    // 🧠 إضافة category إن لم تكن موجودة
    if (!pluginCode.includes('category')) {
      pluginCode = pluginCode.replace(
        'module.exports = {',
        `module.exports = {\n  category: 'mouzan',`
      );
    }

    // 🏷️ استخراج اسم البلجن من الرسالة
    const fullText =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '';

    let pluginFileName = '';
    const parts = fullText.trim().split(/\s+/);

    if (parts.length > 1) {
      const rawName = parts
        .slice(1)
        .join('-')
        .replace(/[^a-zA-Z0-9-_أ-ي]/g, '');
      pluginFileName = `${rawName}.js`;
    } else {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      pluginFileName = `mouzan_${timestamp}.js`;
    }

    const pluginFilePath = path.resolve(`./plugins/${pluginFileName}`);

    try {
      fs.writeFileSync(pluginFilePath, pluginCode);

      await sock.sendMessage(chatId, {
        text: `╭─✔️ *تم الاستدعاء بنجاح*
│ 📄 البلجن: ${pluginFileName}
│ 🩸 تم تفعيل مملكة ظلال
╰─👑 بإشراف يوميلا`,
      }, { quoted: msg });

    } catch (error) {
      console.error('❌ Muzan Error:', error);
      await sock.sendMessage(chatId, {
        text: `╭─💥 *فشل الطقس*
│ حدث خطأ أثناء إنشاء البلجن
╰─🩸 حاول مجددًا أيها النخبة`,
      }, { quoted: msg });
    }
  }
}; 