const fs = require('fs');
const path = require('path');
const { eliteNumbers, extractPureNumber } = require('../haykala/elite');

module.exports = {
  command: 'مع-السلامه',
  description: '👋 توديع مع صوت ومنشن ورسالة مزخرفة للجميع - يُستخدم فقط من النخبة',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNum = extractPureNumber(sender);
    const isGroup = jid.endsWith('@g.us');

    // السماح للنخبة فقط بتنفيذ الأمر
    if (!eliteNumbers.includes(senderNum)) {
      return await sock.sendMessage(jid, {
        text: '🚫 هذا الأمر مخصص للنخبة فقط.',
      }, { quoted: msg });
    }

    const audioPath = path.join(__dirname, '../resources/bob.m4a');
    const imagePath = path.join(__dirname, '../resources/7ARB.jpg');

    try {
      // جلب كل أعضاء الجروب لعمل منشن للجميع
      let mentions = [];

      if (isGroup) {
        const metadata = await sock.groupMetadata(jid);
        mentions = metadata.participants.map(p => p.id);
      }

      // تحميل الصورة
      const hasImage = fs.existsSync(imagePath);
      const imageBuffer = hasImage ? fs.readFileSync(imagePath) : null;

      // الرسالة المزخرفة الأصلية
      const farewellText = '『 ⚠️ مـــجـــهـــولｼ غادر الساحة لبعض من الوقت... 』';

      // إرسال الرسالة المزخرفة + الصورة + منشن لكل الجروب
      await sock.sendMessage(
        jid,
        {
          text: farewellText,
          contextInfo: {
  externalAdReply: {
    title: " مـــجـــهـــولｼ⚡",
    body: "بحبكم  ✨❤️‍🩹",
    thumbnail: imageBuffer,
    mediaType: 1,
    sourceUrl: "https://wa.me/963996097873?text=هلا+يا+حب+♥️",
    showAdAttribution: true
  },
  mentionedJid: mentions
}
        },
        { quoted: msg }
      );

      // إرسال الصوت + منشن لكل الجروب
      await sock.sendMessage(jid, {
        audio: { url: audioPath },
        mimetype: 'audio/mpeg',
        ptt: true,
        mentions
      }, { quoted: msg });

    } catch (err) {
      console.error('✗✗ خطأ في أمر سلام:', err);
      await sock.sendMessage(jid, {
        text: '❌ حصل خطأ أثناء تنفيذ أمر السلام.',
      }, { quoted: msg });
    }
  }
};