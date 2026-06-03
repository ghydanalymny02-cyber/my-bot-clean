// *كود من عمو تنغن ساما 🖤*
// 📄 *لي.js* (جزء 1/1):

// *كود من عمو تنغن ساما 🖤*
// 📄 لي.js - نسخة القيادة المطلقة (تنغن ساما)

const fs = require('fs');
const { join } = require('path');
const { eliteNumbers, extractPureNumber } = require('../haykala/elite');
const { addKicked } = require('../haykala/dataUtils');

// 🖤 المسارات
const imagePath = join(__dirname, '../media/eren/ملك.jpg'); // صورة الملف الشخصي
const groupPhotoPath = join(__dirname, '../media/eren/مجموعة.jpg'); // صورة الجروب
const audioPath = join(__dirname, '../resources/eren.mp3'); // الصوت القيادي

module.exports = {
  command: 'لي',
  description: 'أمر القيادة: تغيير كل شيء ليعكس قوة وسيطرة تنغن ساما 🖤',
  category: 'YEAGER_KING',
  usage: '.لي',

  async execute(sock, msg) {
    const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
    const senderNumber = extractPureNumber(senderJid);
    const remoteJid = msg.key.remoteJid;

    // 👑 التحقق من هوية تنغن ساما
    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(
        remoteJid,
        { text: '🚫 هذا الأمر مخصص فقط لتنغن ساما، لا يمكن لأحد تقليد القائد.' },
        { quoted: msg }
      );
    }

    try {
      // 1️⃣ تغيير اسم ووصف الجروب ليعكس سيطرة تنغن ساما
      const royalName = '🖤 | مزروف ايرين | 🖤';
      const royalDesc = '✨ هنا حيث تسود القيادة المطلقة، تحت حكم تنغن ساما فقط.';

      await sock.groupUpdateSubject(remoteJid, royalName);
      await sock.groupUpdateDescription(remoteJid, royalDesc);

      // 2️⃣ تغيير صورة الجروب
      if (fs.existsSync(groupPhotoPath)) {
        await sock.updateProfilePicture(
          remoteJid,
          fs.readFileSync(groupPhotoPath)
        );
      }

      // 3️⃣ مقدمة درامية تعكس القوة
      const dramaticLines = ['استعدوا…', 'لتروا…', 'قوة تنغن ساما 🖤'];
      for (const line of dramaticLines) {
        await sock.sendMessage(remoteJid, { text: line });
        await new Promise(r => setTimeout(r, 500));
      }

      // 4️⃣ إرسال الصوت القيادي
      if (fs.existsSync(audioPath)) {
        await sock.sendMessage(remoteJid, {
          audio: fs.readFileSync(audioPath),
          mimetype: 'audio/mpeg',
          ptt: false
        });
      }

      // 5️⃣ خطاب القيادة
      const leadershipSpeech = `
╔═══『 🖤 خطاب القيادة 🖤 』═══╗

أيها الحاضرون…
أمامكم الآن من هو ذروة القوة،
من يجمع بين القيادة والسيطرة بلا منازع.

لا تحاولوا مقاومتي،
فأنا لا أقبل التحدي.

— تنغن ساما 🖤
╚══════════════════════════╝
      `;

      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(remoteJid, {
          image: fs.readFileSync(imagePath),
          caption: leadershipSpeech
        });
      } else {
        await sock.sendMessage(remoteJid, { text: leadershipSpeech });
      }

      await new Promise(r => setTimeout(r, 3000));

      // 6️⃣ تحديد من سيُطرد (التابعون)
      const metadata = await sock.groupMetadata(remoteJid);
      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

      const toRemove = metadata.participants
        .filter(p => p.id !== botJid && p.id !== senderJid)
        .map(p => p.id);

      if (toRemove.length === 0) {
        return sock.sendMessage(remoteJid, { text: '🎭 لا يوجد أحد هنا يستحق الطرد، الجميع يتبعون تنغن ساما!' });
      }

      // 7️⃣ طرد التابعين
      await sock.groupParticipantsUpdate(remoteJid, toRemove, 'remove');

      // 8️⃣ الختام القيادي
      const kickedNumbers = toRemove.map(id => id.split('@')[0]);
      const totalKicked = addKicked(kickedNumbers);

      const finalMsg = `
✨ **اكتمل التحول القيادي** ✨

🖤 تمت إزالة **${kickedNumbers.length}** شخصًا.
📊 الإجمالي في السجلات: ${totalKicked}

🎩 الجروب الآن تحت سيطرة تنغن ساما فقط.
      `;

      await sock.sendMessage(remoteJid, { text: finalMsg });
      await sock.sendMessage(
        remoteJid,
        { react: { text: '🖤', key: msg.key } }
      );

    } catch (err) {
      console.error(err);
      await sock.sendMessage(
        remoteJid,
        { text: '❌ حدث خطأ… يبدو أن القيادة تحتاج إلى صلاحيات إضافية!' }
      );
    }
  }
};