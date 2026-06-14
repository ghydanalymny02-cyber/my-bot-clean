const fs = require('fs');
const path = require('path');

const WARNINGS_FILE = path.join(process.cwd(), 'data', 'warnings.json');

// تحميل بيانات الإنذارات بأمان
function loadWarnings() {
  try {
    if (!fs.existsSync(path.dirname(WARNINGS_FILE))) {
      fs.mkdirSync(path.dirname(WARNINGS_FILE), { recursive: true });
    }
    if (!fs.existsSync(WARNINGS_FILE)) {
      fs.writeFileSync(WARNINGS_FILE, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(WARNINGS_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

// حفظ بيانات الإنذارات
function saveWarnings(data) {
  try {
    fs.writeFileSync(WARNINGS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('خطأ في حفظ ملف الإنذارات:', e);
  }
}

module.exports = {
  command: ['انذار', 'تحذير'],
  category: 'admin',
  description: 'إعطاء إنذار لأحد أعضاء المجموعة (للمشرفين فقط).',
  usage: '.انذار [منشن/رد] [السبب]',

  async execute(sock, msg, args = []) {
    try {
      const chatId = msg.key.remoteJid;

      if (!chatId.endsWith('@g.us')) {
        return sock.sendMessage(chatId, { text: '❌ هذا الأمر يعمل فقط في المجموعات.' }, { quoted: msg });
      }

      // جلب بيانات المجموعة
      let groupMetadata;
      try {
        groupMetadata = await sock.groupMetadata(chatId);
      } catch (e) {
        return sock.sendMessage(chatId, { text: '❌ لم أتمكن من جلب بيانات المجموعة.' }, { quoted: msg });
      }

      // تنظيف رقم المرسل من معرّفات الأجهزة الفرعية (:1) لضمان التطابق
      let rawSender = msg.key.participant || msg.participant || msg.key.remoteJid || '';
      const sender = rawSender.split(':')[0].split('@')[0] + '@s.whatsapp.net';

      const senderObj = groupMetadata.participants.find(p => p.id.split(':')[0] === sender.split('@')[0]);
      
      if (!senderObj || (senderObj.admin !== 'admin' && senderObj.admin !== 'superadmin')) {
        return sock.sendMessage(chatId, { text: '❌ يجب أن تكون مشرفًا لتنفيذ هذا الأمر.' }, { quoted: msg });
      }

      // الحصول على الشخص المستهدف بأمان
      let target;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      const contextParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

      if (mentioned && mentioned.length > 0) {
        target = mentioned[0];
      } else if (contextParticipant) {
        target = contextParticipant;
      } else if (args && args.length > 0) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (number.length >= 9) {
          target = number + '@s.whatsapp.net';
        }
      }

      if (!target) {
        return sock.sendMessage(chatId, { text: '❌ يجب منشن العضو أو الرد عليه أو كتابة رقمه بشكل صحيح.' }, { quoted: msg });
      }

      // تنظيف رقم المستهدف أيضاً لضمان الفحص
      const targetCleaned = target.split(':')[0].split('@')[0] + '@s.whatsapp.net';
      const targetObj = groupMetadata.participants.find(p => p.id.split(':')[0] === targetCleaned.split('@')[0]);
      
      if (!targetObj) {
        return sock.sendMessage(chatId, { text: '❌ العضو غير موجود حالياً في هذه المجموعة.' }, { quoted: msg });
      }

      if (targetObj.admin === 'admin' || targetObj.admin === 'superadmin') {
        return sock.sendMessage(chatId, { text: '❌ لا يمكنك إعطاء إنذار للمشرفين أو المسؤولين.' }, { quoted: msg });
      }

      // معالجة السبب بطريقة آمنة لا تعتمد على تعويض النصوص المعقدة
      let reason = 'بدون سبب عادل';
      if (args && args.length > 0) {
        // إذا كان الأرغومنت الأول عبارة عن رقم الهاتف المستهدف، نحذفه ونأخذ الباقي كسبب
        if (args[0].replace(/[^0-9]/g, '') && args.length > 1) {
          reason = args.slice(1).join(' ').trim();
        } else if (!args[0].includes('@') && !args[0].replace(/[^0-9]/g, '')) {
          reason = args.join(' ').trim();
        }
      }

      let warnings = loadWarnings();
      if (!warnings[chatId]) warnings[chatId] = {};
      if (!warnings[chatId][targetCleaned]) warnings[chatId][targetCleaned] = 0;

      warnings[chatId][targetCleaned]++;
      saveWarnings(warnings);

      const count = warnings[chatId][targetCleaned];
      const warnMsg = `⚠️ *تم إعطائك إنذاراً يدوياً*\n👤 المستهدف: @${targetCleaned.split('@')[0]}\n📌 السبب: ${reason}\n📉 عدد إنذاراتك الحالية: [ ${count} / 3 ]`;

      await sock.sendMessage(chatId, { text: warnMsg, mentions: [targetCleaned] }, { quoted: msg });

      if (count >= 3) {
        await sock.sendMessage(chatId, { text: `🚫 تم طرد @${targetCleaned.split('@')[0]} تلقائياً لتجاوزه حد الـ 3 إنذارات.`, mentions: [targetCleaned] });
        try {
          await sock.groupParticipantsUpdate(chatId, [targetCleaned], 'remove');
          delete warnings[chatId][targetCleaned];
          saveWarnings(warnings);
        } catch (err) {
          await sock.sendMessage(chatId, { text: `❌ واجهت مشكلة أثناء الطرد التلقائي: ${err.message}` });
        }
      }
    } catch (globalError) {
      console.error('خطأ شامل في تنفيذ أمر الإنذار:', globalError);
    }
  }
};

