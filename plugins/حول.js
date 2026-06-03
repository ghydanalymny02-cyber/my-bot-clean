module.exports = {
  command: 'حول',
  desc: 'ترحيب بالأعضاء حسب الدولة',
  usage: '.حول @العضو الدولة أو رقمه الدولة',
  group: true,

  async execute(sock, msg) {
    try {
      const args = msg.args || [];
      const contextInfo = msg.message?.extendedTextMessage?.contextInfo || {};
      const mentioned = contextInfo.mentionedJid || msg.mentionedJid || [];

      if (!Array.isArray(args) || args.length < 2) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❗ الاستخدام: .حول @العضو الدولة\nمثال: .حول @123456789 تركيا أو .حول 201234567890 اليابان',
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

      const countryInput = args.slice(1).join(' ').toLowerCase();

      const countries = {
        // عربية
        'سوريا': { flag: '🇸🇾', eng: 'Syria', decorated: '𝑺𝑰𝑹𝒀𝑨' },
        'مصر': { flag: '🇪🇬', eng: 'Egypt', decorated: '𝑬𝑮𝒀𝑷𝑻' },
        'السعودية': { flag: '🇸🇦', eng: 'Saudi Arabia', decorated: '𝑺𝑨𝑼𝑫𝑰' },
        'العراق': { flag: '🇮🇶', eng: 'Iraq', decorated: '𝑰𝑹𝑨𝑸' },
        'المغرب': { flag: '🇲🇦', eng: 'Morocco', decorated: '𝑴𝑶𝑹𝑶𝑪𝑪𝑶' },
        'الجزائر': { flag: '🇩🇿', eng: 'Algeria', decorated: '𝑨𝑳𝑮𝑬𝑹𝑰𝑨' },
        'تونس': { flag: '🇹🇳', eng: 'Tunisia', decorated: '𝑻𝑼𝑵𝑰𝑺' },
        'لبنان': { flag: '🇱🇧', eng: 'Lebanon', decorated: '𝑳𝑬𝑩𝑨𝑵𝑶𝑵' },
        'الأردن': { flag: '🇯🇴', eng: 'Jordan', decorated: '𝑱𝑶𝑹𝑫𝑨𝑵' },
        'الإمارات': { flag: '🇦🇪', eng: 'UAE', decorated: '𝑼𝑨𝑬' },
        'قطر': { flag: '🇶🇦', eng: 'Qatar', decorated: '𝑸𝑨𝑻𝑨𝑹' },
        'الكويت': { flag: '🇰🇼', eng: 'Kuwait', decorated: '𝑲𝑼𝑾𝑨𝑰𝑻' },
        'البحرين': { flag: '🇧🇭', eng: 'Bahrain', decorated: '𝑩𝑨𝑯𝑹𝑨𝑰𝑵' },
        'عمان': { flag: '🇴🇲', eng: 'Oman', decorated: '𝑶𝑴𝑨𝑵' },
        'ليبيا': { flag: '🇱🇾', eng: 'Libya', decorated: '𝑳𝑰𝑩𝒀𝑨' },
        'فلسطين': { flag: '🇵🇸', eng: 'Palestine', decorated: '𝑷𝑨𝑳𝑬𝑺𝑻𝑰𝑵𝑬' },
        'تركيا': { flag: '🇹🇷', eng: 'Turkey', decorated: '𝑻𝑼𝑹𝑲𝑬𝒀' },

        // أجنبية مشهورة
        'اليابان': { flag: '🇯🇵', eng: 'Japan', decorated: '𝑱𝑨𝑷𝑨𝑵' },
        'كوريا': { flag: '🇰🇷', eng: 'Korea', decorated: '𝑲𝑶𝑹𝑬𝑨' },
        'الصين': { flag: '🇨🇳', eng: 'China', decorated: '𝑪𝑯𝑰𝑵𝑨' },
        'الهند': { flag: '🇮🇳', eng: 'India', decorated: '𝑰𝑵𝑫𝑰𝑨' },
        'أمريكا': { flag: '🇺🇸', eng: 'USA', decorated: '𝑼𝑺𝑨' },
        'كندا': { flag: '🇨🇦', eng: 'Canada', decorated: '𝑪𝑨𝑵𝑨𝑫𝑨' },
        'ألمانيا': { flag: '🇩🇪', eng: 'Germany', decorated: '𝑮𝑬𝑹𝑴𝑨𝑵𝒀' },
        'فرنسا': { flag: '🇫🇷', eng: 'France', decorated: '𝑭𝑹𝑨𝑵𝑪𝑬' },
        'إسبانيا': { flag: '🇪🇸', eng: 'Spain', decorated: '𝑺𝑷𝑨𝑰𝑵' },
        'إيطاليا': { flag: '🇮🇹', eng: 'Italy', decorated: '𝑰𝑻𝑨𝑳𝒀' },
        'روسيا': { flag: '🇷🇺', eng: 'Russia', decorated: '𝑹𝑼𝑺𝑺𝑰𝑨' },
        'البرازيل': { flag: '🇧🇷', eng: 'Brazil', decorated: '𝑩𝑹𝑨𝒁𝑰𝑳' },
        'بريطانيا': { flag: '🇬🇧', eng: 'UK', decorated: '𝑬𝑵𝑮𝑳𝑨𝑵𝑫' },
        'أستراليا': { flag: '🇦🇺', eng: 'Australia', decorated: '𝑨𝑼𝑺𝑻𝑹𝑨𝑳𝑰𝑨' },
      };

      const country = countries[countryInput] || countries['سوريا'];

      let groupName = 'المجموعة';
      if (msg.key.remoteJid.endsWith('@g.us')) {
        try {
          const metadata = await sock.groupMetadata(msg.key.remoteJid);
          groupName = metadata.subject || groupName;
        } catch {}
      }

      let userPfp;
      try {
        userPfp = await sock.profilePictureUrl(targetJid, 'image');
      } catch {
        userPfp = null;
      }

      const caption = `${country.decorated} ON TOP 🫦${country.flag}
—————
نورت ${country.eng} يا @${targetJid.split('@')[0]} ${country.flag}
من الآن أنت ضمن منظمة ${country.eng} 🫦
في منظمة ${country.eng} :
① ننشر أهم الزرفات 💰
② نوثق الباند 📟
③ نوزع أرقام 🪀
④ نوزع بسكوت 🍫
⑤ نوزع بوتات 🤖
—————
*《تـــوقـ✍︎ـيـع》↡*
『 𝑮𝑶𝑱𝑶⊰𝑩𝑶𝑻 ❄️ ♔ 』
—————`.trim();

      const messageData = {
        mentions: [targetJid],
        contextInfo: {
          mentionedJid: [targetJid],
          externalAdReply: {
            title: `من ${country.eng} ${country.flag}`,
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
      console.error("❌ خطأ في أمر حول:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حصل خطأ أثناء تنفيذ أمر حول.',
      }, { quoted: msg });
    }
  }
};