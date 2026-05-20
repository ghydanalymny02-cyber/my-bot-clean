const fs = require('fs');
const path = require('path');

module.exports = {
name: 'مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹',
command: ['مطور'],
description: 'يعرض معلومات مطور البوت',
category: 'عام',

async execute(sock, msg) {
try {
const developerName = 'مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹';
const developerEmail = 'ghydanalymny02@gmail.com';
const developerPhone = '+967715677073';
const developerWaid = '967700821174';

const instagramLink = 'https://www.instagram.com/iqahta?igsh=dWs4d3V1M2IwMTd6';  
  const youtubeLink = '';  
  const whatsappChannel = '';  

    
  const vcard = `BEGIN:VCARD

VERSION:3.0
FN:${developerName}
TEL;type=CELL;waid=${developerWaid}:${developerPhone}
EMAIL;TYPE=INTERNET:${developerEmail}
NOTE: لا حد يحكي معي إلا للضرورة بالخاص
YOUTUBE: ${youtubeLink}
INSTAGRAM: ${instagramLink}
WHATSAPP_CHANNEL: ${whatsappChannel}
END:VCARD`;

await sock.sendMessage(msg.key.remoteJid, {  
    contacts: {  
      displayName: `مطور ${developerName}`,  
      contacts: [{ vcard }]  
    }  
  }, { quoted: msg });  

    
  const instructionsText = `╭── 🎯 *مـعـلـومـات الـمـطـور* ──╮

╰─➤ 👤 الاسـم: 𓆩مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹𓆪
╰─➤ 📞 الرقم: +967715677073
╰─➤ ✉️ الإيميل: ghydanalymny02@gmail.com

━━━━━━━━━━━━━━━

╰─🎥 قـنـاة الـيـوتـيـوب:
🔗 
━━━━━━━━━━━━━━━

╰─📸 حـسـاب الإنـسـتـغـرام:
🔗 https://www.instagram.com/iqahta?igsh=dWs4d3V1M2IwMTd6
━━━━━━━━━━━━━━━

╰─💬 قـنـاة واتـسـاب الـرسـمـيـة:
🔗 

━━━━━━━━━━━━━━━

╰─🚫 مـلاحـظـة هـامـة:
⛔ الرجاء عدم الإرسال في الخاص إلا للضرورة فقط.

╰── ❖ 𝐌𝐀𝐃𝐄 𝐁𝐘 مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ❖ ──╯`;

const thumbnailPath = path.join(__dirname, 'image.jpeg');
      const thumbnailBuffer = fs.existsSync(thumbnailPath) ? fs.readFileSync(thumbnailPath) : null;


  await sock.sendMessage(msg.key.remoteJid, {  
    text: instructionsText,  
    contextInfo: {  
      externalAdReply: {  
        title: `مطور البوت ${developerName}`,  
        body: 'روابط التواصل الاجتماعي',  
        thumbnail: thumbnailBuffer,  
        mediaType: 1,  
        renderLargerThumbnail: true  
      }  
    }  
  }, { quoted: msg });  

} catch (err) {  
  console.error('❌ خطأ في أمر مطور:', err);  
  await sock.sendMessage(msg.key.remoteJid, {  
    text: '❌ حصل خطأ أثناء عرض معلومات المطور.'  
  }, { quoted: msg });  
}

}
};

