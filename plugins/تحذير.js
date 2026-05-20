const fs = require('fs');
const path = require('path');
const { isElite } = require('../haykala/elite');

const warningsFile = path.join(__dirname, '../data/warnings.json');
if (!fs.existsSync(warningsFile)) fs.writeFileSync(warningsFile, '{}');
let warnings = JSON.parse(fs.readFileSync(warningsFile));

function saveWarnings() { fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2)); }

module.exports = {
    command: 'تحذير',
    category: 'admin',
    description: 'يعطي تحذير لعضو وإذا وصل لـ 3 يتم طرده تلقائيًا.',
    usage: '.تحذير @العضو',
    group: true,
    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!(await isElite(sender))) {
            return sock.sendMessage(chatId, { text: '❌ هذا الأمر مخصص للمشرفين فقط.' }, { quoted: msg });
        }

        const reply = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const targetJid = reply || mentions[0];

        if (!targetJid) {
            return sock.sendMessage(chatId, { text: '❌ من فضلك منشن عضو أو رد على رسالته لإعطائه تحذير.' }, { quoted: msg });
        }

        if (!warnings[chatId]) warnings[chatId] = {};
        if (!warnings[chatId][targetJid]) warnings[chatId][targetJid] = 0;

        warnings[chatId][targetJid]++;
        saveWarnings();

        const userWarnings = warnings[chatId][targetJid];

        if (userWarnings >= 3) {
            await sock.groupParticipantsUpdate(chatId, [targetJid], 'remove');
            delete warnings[chatId][targetJid];
            saveWarnings();

            return sock.sendMessage(chatId, {
                text: `❌ تم طرد @${targetJid.split('@')[0]} بعد حصوله على 3 تحذيرات!`,
                mentions: [targetJid]
            }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
            text: `⚠️ تم إعطاء @${targetJid.split('@')[0]} تحذير (${userWarnings}/3).`,
            mentions: [targetJid]
        }, { quoted: msg });
    }
};
const fs = require('fs');
const path = require('path');

const WARNINGS_FILE = path.join(__dirname, '../data/warnings.json'); // غير المسار حسب مكان تخزينك

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
  command: 'انذار',
  category: 'admin',
  description: 'إعطاء إنذار لأحد أعضاء المجموعة (للمشرفين فقط).',

  async execute(sock, msg, args = []) {
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

    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;

    // التحقق من أن المرسل مشرف أو مسؤول في المجموعة
    const senderObj = groupMetadata.participants.find(p => p.id === sender);
    if (!senderObj || (senderObj.admin !== 'admin' && senderObj.admin !== 'superadmin')) {
      return sock.sendMessage(chatId, { text: '❌ يجب أن تكون مشرفًا لتنفيذ هذا الأمر.' }, { quoted: msg });
    }

    // الحصول على الجهة التي تريد إنذارها (من منشن أو الرد أو رقم)
    let target;

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const contextParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (mentioned?.length > 0) {
      target = mentioned[0];
    } else if (contextParticipant) {
      target = contextParticipant;
    } else if (args.length > 0) {
      // دعم رقم فقط بدون @s.whatsapp.net
      const number = args[0].replace(/[^0-9]/g, '');
      target = number + '@s.whatsapp.net';
    } else {
      return sock.sendMessage(chatId, { text: '❌ يجب منشن العضو أو الرد عليه أو كتابة رقمه.' }, { quoted: msg });
    }

    // تحقق أن العضو موجود في المجموعة
    const targetObj = groupMetadata.participants.find(p => p.id === target);
    if (!targetObj) {
      return sock.sendMessage(chatId, { text: '❌ العضو غير موجود في المجموعة.' }, { quoted: msg });
    }

    // منع إنذار المشرفين
    if (targetObj.admin === 'admin' || targetObj.admin === 'superadmin') {
      return sock.sendMessage(chatId, { text: '❌ لا يمكنك إعطاء إنذار للمشرفين أو المسؤولين.' }, { quoted: msg });
    }

    // تحميل الإنذارات وتحديثها
    let warnings = loadWarnings();
    if (!warnings[chatId]) warnings[chatId] = {};
    if (!warnings[chatId][target]) warnings[chatId][target] = 0;

    warnings[chatId][target]++;
    saveWarnings(warnings);

    const count = warnings[chatId][target];
    const reason = args.slice(1).join(' ') || 'بدون سبب';

    // رسالة الإنذار
    const warnMsg = `⚠️ تم إعطائك إنذارًا\n📌 السبب: ${reason}\n⚠️ عدد الإنذارات: ${count} / 3`;

    // إرسال رسالة إنذار مع منشن العضو
    await sock.sendMessage(chatId, {
      text: warnMsg,
      mentions: [target]
    }, { quoted: msg });

    // إذا وصل عدد الإنذارات 3، طرد العضو
    if (count >= 3) {
      await sock.sendMessage(chatId, {
        text: `🚫 تم طرد @${target.split('@')[0]} بسبب تجاوز 3 إنذارات.`,
        mentions: [target]
      }, { quoted: msg });

      try {
        await sock.groupParticipantsUpdate(chatId, [target], 'remove');
        // إعادة ضبط الإنذارات بعد الطرد
        warnings[chatId][target]const fs = require('fs');
const path = require('path');

// نفس مسار الملف المستخدم في أمر المسح الخاص بك تماماً لضمان الدمج 100%
const warnsFile = path.join(__dirname, '../data/warns.json');

function loadWarns() {
  try {
    if (!fs.existsSync(warnsFile)) fs.writeFileSync(warnsFile, '{}');
    const data = fs.readFileSync(warnsFile);
    return JSON.parse(data.length ? data : '{}');
  } catch {
    fs.writeFileSync(warnsFile, '{}');
    return {};
  }
}

function saveWarns(warns) {
  fs.writeFileSync(warnsFile, JSON.stringify(warns, null, 2));
}

module.exports = {
  // كود التفتيش والمراقبة التلقائية للروابط (يعمل تلقائياً بدون حاجة لأمر)
  async execute(sock, msg) {
    const groupId = msg.key.remoteJid;
    
    // التأكد أن الرسالة داخل مجموعة
    if (!groupId.endsWith('@g.us')) return;

    const text = msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.body || '';
    const linkRegex = /https?:\/\/[^\s]+/gi;

    // إذا احتوت الرسالة على رابط، يبدأ التعامل النخبوي معها
    if (linkRegex.test(text)) {
      try {
        const metadata = await sock.groupMetadata(groupId);
        const senderId = msg.participant || msg.key.participant || msg.key.remoteJid;

        // التحقق هل مرسل الرابط مشرف؟ (حتى لا يتم معاقبة المشرفين)
        const isAdmin = metadata.participants.some(
          p => p.id === senderId && (p.admin === 'admin' || p.admin === 'superadmin')
        );
        if (isAdmin) return; 

        // التحقق هل البوت مشرف ليتمكن من اتخاذ الإجراء الأمني؟
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const botIsAdmin = metadata.participants.some(
          p => p.id === botId && (p.admin === 'admin' || p.admin === 'superadmin')
        ); 