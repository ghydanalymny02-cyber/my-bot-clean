// *كود من عمو اسكانور المظ 🫦*
// 📄 *انشئ.js* (جزء 1/1):

const { isElite } = require('../haykala/elite');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'انشئ',
  category: 'DEVELOPER',
  description: '✨ ينشئ جروب واحد للنخبة فقط، بالاسم اللي تكتبه أو "جروب جديد " إذا ما كتبتش',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;

    if (!isElite(sender)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 ليس لديك صلاحية لاستخدام هذا الأمر!'
      }, { quoted: msg });
    }

    try {
      let fullMessage = '';
      if (msg.message) {
        fullMessage = msg.message.conversation
          || (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text)
          || (typeof msg.text === 'string' && msg.text)
          || '';
      }
      const commandLength = '.انشئ'.length;
      const groupNameInput = fullMessage.slice(commandLength).trim();
      const groupName = groupNameInput.length > 0 ? groupNameInput : ' ❄ مـــجـــهـــول ';
      const participants = [];

      // إنشاء الجروب
      const group = await sock.groupCreate(groupName, participants);

      // رفع صورة الغلاف (لو موجودة) من مجلد media داخل جذر البوت
      const imgPath = path.join(process.cwd(), 'resources', 'escanor.jpg');
      let imageFailed = false;
      if (fs.existsSync(imgPath)) {
        try {
          const buffer = fs.readFileSync(imgPath);
          await sock.groupUpdatePicture(group.id, buffer);
        } catch (imgErr) {
          imageFailed = true;
          console.error('⚠️ لم يتم رفع صورة غلاف الجروب — تم تجاهل الخطوة:', imgErr);
        }
      }

      // تحديث وصف المجموعة بعظمة إيسكانور مع الفخامة والرموز
      const descriptionText = `
👑✨ 『 عرش يوميلا 』 ✨👑

🔥🌞 هنا يسطع ملك الشمس، سلطان القوة المطلقة،  
⚡️ إيسكانور، القوة التي تهز الأرض والسماء،  
👹 السيد الأعظم الذي تحترق أمامه جحافل الأعداء.

🛡️ لا يقف في هذا الحصن المقدس إلا الأقوياء،  
🗡️ حيث العظمة قانون والهيبة تاج،  
🌋 هذه المملكة هي للنخبة فقط.

👁️‍🗨️ عينه الحادة كالصقر، لا تغفل عن تحديات الأعداء،  
🔥 قلبه من نار أبدية، وقوته لا تقهر،  
🦅 النجم الساطع في فضاء الأساطير،  
👑 إيسكانور: الملك الذي لا يُضاهى والأسطورة الخالدة.

⚔️ إن كنت تجرؤ، فادخل لتشهد العظمة بعينيك،  
🌟 هذا هو حصن الأبطال، قصر الشمس، مملكة الأساطير.

『 🏆 المجد والعظمة درعنا الأبدي! 🏆 』
`.trim();

      await sock.groupUpdateDescription(group.id, descriptionText);

      // جلب رابط الدعوة
      const inviteCode = await sock.groupInviteCode(group.id);

      let successText = `✅ تم إنشاء الجروب بنجاح!\n📎 رابط الدعوة: https://chat.whatsapp.com/${inviteCode}`;
      if (imageFailed) {
        successText += `\n\n⚠️ ملاحظة: لم أتمكّن من رفع صورة غلاف الجروب، تم إنشاء الجروب بدون صورة.`;
      }

      await sock.sendMessage(msg.key.remoteJid, { text: successText }, { quoted: msg });

    } catch (error) {
      console.error('❌ خطأ أثناء إنشاء الجروب:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حدث خطأ أثناء محاولة إنشاء الجروب!'
      }, { quoted: msg });
    }
  }
};