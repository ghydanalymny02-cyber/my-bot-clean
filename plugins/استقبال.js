// ╔════════════════════════════╗
// 👑 Yumila Rights Controller 🛡
// Muzan Kibutsuji – Demon King
// ╚════════════════════════════╝

const { isElite, extractPureNumber } = require('../haykala/elite');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: '♕',
  category: 'tools',
  description: '📢 منشن خفي لاستقبال التبادلات + صورة وصوت',

  async execute(sock, msg) {
    try {
      const groupJid = msg.key.remoteJid;
      const senderJid = msg.key.participant || groupJid;
      const senderNumber = extractPureNumber(senderJid);

      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, {
          text: '🚫 هذا الأمر يعمل داخل *المجموعات فقط*.'
        }, { quoted: msg });
      }

      if (!isElite(senderNumber)) {
        return sock.sendMessage(groupJid, {
          text: '🔒 هذا الأمر مخصص *لأعضاء النخبة فقط*.'
        }, { quoted: msg });
      }

      const metadata = await sock.groupMetadata(groupJid);
      const mentions = metadata.participants.map(p => p.id);

      const text = `
╔═══『 ✦ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ✦ 』═══╗
✦ 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝑨𝒍𝒍 ✦
𝑴𝒖𝒛𝒂𝒏 𝑲𝒊𝒃𝒖𝒕𝒔𝒖𝒋𝒊 𝒘𝒆𝒍𝒄𝒐𝒎𝒆𝒔 𝒚𝒐𝒖
╚══════════════════════════╝

『 استقبال ﹝🩸﹞مـــجـــهـــول 』

✦ أهلاً بك في استقبالنا ✦
لدخولك إلى *الجروب الأساسي* يرجى الالتزام بما يلي:
• اختيار *لقب شخصية* واضح ومناسب
• وضع *صورة للشخصية* المختارة
• الالتزام بالتنسيق والتعليمات المطلوبة
• التعاون مع المشرفين لحين إتمام القبول

📜 القوانين:
• الالتزام الكامل بقوانين المجموعة
• الاحترام المتبادل بين جميع الأعضاء
• 🚫 ممنوع التواصل غير اللائق في الخاص بين الأعضاء
• ❗ في حال تعرض أي عضو للإزعاج أو المضايقة،
  يتم التوجه مباشرةً إلى أحد *المشرفين* لعرض المشكلة

⚠️ مخالفة القوانين تعرض صاحبها للمساءلة

⊰ 𝑩𝑶𝑻 مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🩸 ⊱
`;

      // إرسال الصورة مع النص في رسالة واحدة + منشن خفي
      const imagePath = path.join(__dirname, '../media/moo.jpg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(groupJid, {
          image: fs.readFileSync(imagePath),
          caption: text,
          contextInfo: { mentionedJid: mentions }
        });
      }

      // إرسال الصوت بشكل منفصل
      const audioPath = path.join(__dirname, '../media/mooo.mp3');
      if (fs.existsSync(audioPath)) {
        await sock.sendMessage(groupJid, {
          audio: fs.readFileSync(audioPath),
          mimetype: 'audio/mpeg',
          ptt: false
        });
      }

    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ:\n\`\`\`${err.message || err}\`\`\``
      }, { quoted: msg });
    }
  }
};