const fs = require('fs');
const path = require('path');
const { isElite } = require('../haykala/elite');

const WARNINGS_FILE = path.join(__dirname, '../data/warnings.json');

// تحميل بيانات الإنذارات
function loadWarnings() {
  if (!fs.existsSync(WARNINGS_FILE)) {
    fs.writeFileSync(WARNINGS_FILE, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(WARNINGS_FILE));
}

// حفظ بيانات الإنذارات
function saveWarnings(data) {
  fs.writeFileSync(WARNINGS_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  command: 'فك-انذار',
  category: 'group',
  description: 'إزالة إنذار واحد من عضو في المجموعة مع سبب (للمشرفين أو النخبة فقط).',
  usage: '.فك @العضو [السبب]',

  async execute(sock, msg, args = []) {
    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, { text: '❌ هذا الأمر يعمل فقط في المجموعات.' }, { quoted: msg });
    }

    let groupMetadata;
    try {
      groupMetadata = await sock.groupMetadata(chatId);
    } catch (e) {
      return sock.sendMessage(chatId, { text: '❌ لم أتمكن من جلب بيانات المجموعة.' }, { quoted: msg });
    }

    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
    const senderObj = groupMetadata.participants.find(p => p.id === sender);
    const isAdmin = senderObj && (senderObj.admin === 'admin' || senderObj.admin === 'superadmin');
    const isEliteUser = await isElite(sender);

    if (!isAdmin && !isEliteUser) {
      return sock.sendMessage(chatId, { text: '❌ هذا الأمر مخصص للمشرفين أو النخبة فقط.' }, { quoted: msg });
    }

    // الحصول على العضو الهدف (من منشن أو رد)
    let target;
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const contextParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (mentioned?.length > 0) {
      target = mentioned[0];
    } else if (contextParticipant) {
      target = contextParticipant;
    } else {
      return sock.sendMessage(chatId, { text: '❌ لازم ترد أو تمنشن العضو اللي عايز تفك إنذاره 😏' }, { quoted: msg });
    }

    // التحقق من وجود العضو في المجموعة
    const targetObj = groupMetadata.participants.find(p => p.id === target);
    if (!targetObj) {
      return sock.sendMessage(chatId, { text: '❌ العضو غير موجود في المجموعة.' }, { quoted: msg });
    }

    let warnings = loadWarnings();
    if (!warnings[chatId]) warnings[chatId] = {};
    if (!warnings[chatId][target] || !warnings[chatId][target].count || warnings[chatId][target].count <= 0) {
      return sock.sendMessage(chatId, { text: '❌ العضو ليس لديه أي إنذارات.' }, { quoted: msg });
    }

    // تقليل إنذار واحد فقط
    warnings[chatId][target].count--;

    // إزالة آخر سبب (لو موجود)
    if (warnings[chatId][target].reasons && warnings[chatId][target].reasons.length > 0) {
      warnings[chatId][target].reasons.pop();
    }

    saveWarnings(warnings);

    const count = warnings[chatId][target].count;

    // استخراج السبب سواء رد أو منشن (زي كود انذار بالظبط)
    let fullText = msg.message?.extendedTextMessage?.text || '';
    let reason;

    if (mentioned?.length > 0) {
      // لو منشن
      reason = fullText.split(' ').slice(2).join(' ').trim();
    } else {
      // لو ريبلاي
      reason = fullText.split(' ').slice(1).join(' ').trim();
    }

    if (!reason) reason = 'بقا محترم 🥀';

    await sock.sendMessage(chatId, {
      text: `✅ تم *فك إنذار واحد* من @${target.split('@')[0]}.\n📋 *السبب:* ${reason}\n⚠️ *عدد الإنذارات الحالي:* ${count}`,
      mentions: [target]
    }, { quoted: msg });
  }
};