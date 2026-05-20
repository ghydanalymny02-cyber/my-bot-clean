module.exports = {
  command: 'ليبي',
  desc: 'ترحيب بالليبيين',
  usage: '.ليبي @العضو أو رقمه لقبه',
  group: true,

  async execute(sock, msg) {
    try {
      const args = msg.args || [];
      const contextInfo = msg.message?.extendedTextMessage?.contextInfo || {};
      const mentioned = contextInfo.mentionedJid || msg.mentionedJid || [];

      if (!Array.isArray(args) || args.length < 2) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❗ الاستخدام: .ليبي @العضو أو رقمه لقبه\nمثال: .ليبي @123456789 زورو أو .ليبي 201234567890 زورو',
        }, { quoted: msg });
      }

      let targetJid;

      if (mentioned.length > 0) {
        targetJid = mentioned[0];
      } else if (/^\d{8,15}$/.test(args[0])) {
        targetJid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      } else {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❗ لم يتم العثور على العضو. تأكد من عمل منشن أو إدخال رقم صحيح.',
        }, { quoted: msg });
      }

      const nickname = args.slice(1).join(' ');

      // جلب اسم الجروب
      let groupName = 'المجموعة';
      if (msg.key.remoteJid.endsWith('@g.us')) {
        try {
          const metadata = await sock.groupMetadata(msg.key.remoteJid);
          groupName = metadata.subject || groupName;
        } catch (e) {
          console.log("فشل في جلب اسم الجروب:", e.message);
        }
      }

      // محاولة جلب صورة العضو
      let userPfp;
      try {
        userPfp = await sock.profilePictureUrl(targetJid, 'image');
      } catch {
        userPfp = null;
      }

      const caption = `𝑳𝒊𝑩𝒀𝑨 ON TOP 🫦🇱🇾
      —————
     نورت ليبيا يا @${targetJid.split('@')[0]} 🇱🇾
     من الان انت ضمن منظمة ليبيا 🫦
     في منظمة ليبيا : 🇱🇾
     ① ننشر اهم الزرفات 💰
     ② توثيق الباند 📟
     ③ نوزع ارقام 🪀
     ④ نوزع بسكوت 🍫
     ⑤ نوزع بوتات 🤖
     —————
     *《تـــوقـ✍︎ـيـع》↡*
     『 𝒀𝑼𝑴𝑰𝑳𝑨 ♔ 』
     —————`.trim();

      const messageData = {
        mentions: [targetJid],
        contextInfo: {
          mentionedJid: [targetJid],
          externalAdReply: {
            title: `${nickname} أنت الان ليبي 🇱🇾`,
            body: `تفاعل في ${groupName}`,
            thumbnailUrl: userPfp || undefined,
            sourceUrl: `https://wa.me/${targetJid.split('@')[0]}`,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      if (userPfp) {
        messageData.image = { url: userPfp };
        messageData.caption = caption;
      } else {
        messageData.text = caption;
      }

      await sock.sendMessage(msg.key.remoteJid, messageData, { quoted: msg });

    } catch (err) {
      console.error("❌ خطأ في أمر الترحيب:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حصل خطأ أثناء إرسال رسالة الترحيب.',
      }, { quoted: msg });
    }
  }
};