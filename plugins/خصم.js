const fs = require('fs');
const path = require('path');
const { eliteNumbers, extractPureNumber } = require('../haykala/elite'); // استيراد أرقام النخبة ووظيفة استخراج الرقم النقي

const pointsFile = path.join(__dirname, '../data/points.json');

// دالة لتحميل النقاط من ملف JSON
function loadPoints() {
  if (!fs.existsSync(pointsFile)) {
    fs.writeFileSync(pointsFile, '{}', 'utf8'); // إنشاء الملف إذا لم يكن موجوداً
  }
  return JSON.parse(fs.readFileSync(pointsFile, 'utf8')); // قراءة وتحليل البيانات
}

// دالة لحفظ النقاط في ملف JSON
function savePoints(points) {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2), 'utf8'); // حفظ البيانات مع تنسيق جميل
}

module.exports = {
  command: 'خصم',
  description: '➖ خصم نقاط من نفسك أو من شخص آخر (للمطور فقط)',
  usage: '.خصم 500 @العضو',
  category: 'DEVELOPER',

  async execute(sock, msg, args) {
    const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
    const senderNumber = extractPureNumber(senderJid); // الحصول على الرقم النقي للمرسل

    // التحقق إذا كان المرسل من قائمة أرقام النخبة (المطورين)
    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 هذا الأمر مخصص للمطور فقط!',
      }, { quoted: msg });
    }

    const text = msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.body || '';
    // استخراج عدد النقاط من النص باستخدام regex دقيق
    const numberMatch = text.match(/^\.?خصم\s+(\d+)/i); 

    // إذا لم يتم تحديد عدد النقاط
    if (!numberMatch) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❌ يرجى كتابة عدد النقاط. مثال:\n\n.خصم 500 @العضو',
      }, { quoted: msg });
    }

    const amount = parseInt(numberMatch[1]); // تحويل العدد إلى رقم صحيح
    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    
    // تحديد الهدف: إذا كان هناك منشن، نستخدم رقمه النقي، وإلا نستخدم رقم المرسل
    const targetId = mentionedJid ? extractPureNumber(mentionedJid) : senderNumber;

    const points = loadPoints(); // تحميل النقاط الحالية
    const current = points[targetId] || 0; // الحصول على رصيد النقاط الحالي للهدف

    // التحقق من أن النقاط المتاحة كافية للخصم
    if (current < amount) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ لا يمكن خصم *${amount}* نقطة من <@${targetId}>\n📉 رصيده الحالي: *${current}* فقط.`,
        mentions: [mentionedJid || senderJid] // التأكد من الإشارة للشخص الصحيح
      }, { quoted: msg });
    }

    points[targetId] -= amount; // خصم النقاط
    savePoints(points); // حفظ النقاط بعد التعديل

    // بناء رسالة التأكيد بناءً على إذا تم الخصم من شخص آخر أو من المرسل نفسه
    const confirmationText = mentionedJid
      ? `╭───❖ 『 *تم الخصم بنجاح* 』❖───╮\n\n➖ تم خصم *${amount}* نقطة من:\n👤 <@${targetId}>\n📞 الرقم: *${targetId}*\n\n╰─⟡ *نفذها المطور حرب* ⟡─╯`
      : `╭───❖ 『 *تم الخصم منك* 』❖───╮\n\n➖ تم خصم *${amount}* نقطة من رصيدك\n📞 رقمك: *${targetId}*\n\n╰─⟡ *راجع حساباتك يا بطل!* ⟡─╯`;

    await sock.sendMessage(msg.key.remoteJid, {
      text: confirmationText,
      mentions: [mentionedJid || senderJid] // التأكد من الإشارة الصحيحة في الرسالة
    }, { quoted: msg });
  }
};
