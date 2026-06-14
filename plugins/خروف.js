// *حقوق مطور يوميلا  🛡*
// 📄 *خروف.js* (جزء 1/1):

const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'خروف',
  description: '🐏 استمارة ساخرة مع منشن الشخص مباشرة',
  usage: '.خروف @العضو',
  category: 'سخرية',

  async execute(sock, msg) {
    try {
      // ✅ مسار الصورة
      const imgPath = path.join(__dirname, '../resources/maaa.jpg');
      if (!fs.existsSync(imgPath)) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ الصورة maaa.jpg غير موجودة داخل resources!'
        }, { quoted: msg });
      }

      // ✅ تحديد من تم منشنه أو الرد عليه
      const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;
      let targetJid;

      if (mentionedJids.length > 0) targetJid = mentionedJids[0];
      else if (quotedParticipant) targetJid = quotedParticipant;
      else return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ استخدم الأمر مع منشن شخص أو رد على رسالته.'
      }, { quoted: msg });

      const targetName = targetJid.split('@')[0]; // الاسم فقط للعرض

      // 🌌 عبارات سخيفة مع المنشن
      const messages = [
        `دخل ${targetName} فالهالا والكل صار يركض!`,
        `😂 لا تقلق، ${targetName} معك.. أو ربما ضدك!`,
        `🔥 ${targetName} بدأ الهجوم، جهز نفسك للثغاء!`,
        `💀 لا أحد يوقف ${targetName} اليوم!`,
        `🤣 ${targetName} حاول الهروب، بس الخروف أسرع!`,
        `🥛 ${targetName} يشرب الحليب ويتخيل نفسه ملك الزحف!`,
        `📢 تحذير: ${targetName} على الأبواب، تجنب المعارك معه!`,
        `🦴 ${targetName} يحب المعارك.. ولا أحد يستطيع إيقافه!`,
        `🎭 في مملكة الخرفان، ${targetName} هو الملك بلا منازع!`
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      // 🌌 الاستمارة مع المنشن
      const form = `
╔═══ 🎻 • ✦ • 🎻 ═══╗
       🐑 خرفان.. حول العالم 🌍
╚═══ 🌿 • ✦ • 🌿 ═══╝

🎤 *الاسم:* @${targetName}  
🌍 *الأصل:* فالهالا – عالم الخرفان  
✨ *الميلاد:* مجهول (خروف حر)  
🎶 *المهنة:* خروف رسمي – ثغاء محترف – نسونجي زاحف
🏆 *الألقاب:* ملك الزحف بطل الخرفنة   

🪶 ━━━━━━━━━━━━━━ 🪶
🌌 *حالة اليوم:*  
👻 ${randomMessage}

🐏 @${targetName} حاول اليوم الركض عبر الساحة ولم يفلح.
🔥 @${targetName} تسبب بفوضى كبيرة بين الخرفان.
🤣 @${targetName} أضحك الجميع بثغائه الرهيب!

🐏 " @${targetName}.. خروف لا يُقهر، رغم كل الفوضى حوله" 🐏
❖ ━━━━━━━━━━━━━━ ❖
𝑬𝑺𝑪𝑨𝑵𝑶𝑹⊰𝑩𝑶𝑻
`;

      const imageBuffer = fs.readFileSync(imgPath);
      await sock.sendMessage(msg.key.remoteJid, {
        image: imageBuffer,
        caption: form,
        mentions: [targetJid] // ✅ المنشن يعمل بشكل صحيح
      }, { quoted: msg });

    } catch (error) {
      console.error('❌ خطأ في أمر خروف:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حدث خطأ أثناء إرسال استمارة الخروف.'
      }, { quoted: msg });
    }
  }
};