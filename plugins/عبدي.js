const { eliteNumbers, extractPureNumber } = require('../haykala/elite');

const funnyTexts = [
"🫦 لقد اصبحت عبدا عندي مبرووك يا {tag}!",
"😂 انت من دلوقتي شغال عندي يا {tag}",
"😎 مبرووك الترقيه يا {tag} بقت عبد رسمي عندي",
"خخخخخ 🐒 يا {tag} خلاص بقت مملوك عندي",
"🫡 هات العصاية يا عبدي {tag}",
"🤣 يا جماعة صقفوا لعبدي الجديد {tag}",
"👑 {tag} من النهاردة عبد تحت سلطتي",
"🪓 هات العصايه يا عبدي {tag} عشان أربيك",
"🔥 يا عبدي {tag} تعالى كدا ووريني هتستحمل ولا لأ",
"💀 انت مش عبد وبس يا {tag} دا انت سلاحي الشخصي",
"🤣 تعالى كدا يا {tag} عشان اعملك طقطقه محترمة",
"😏 يا عبدي {tag} مكانك تحت جزمتي",
"🦵 دوس عليك يا {tag} ولا أسيبك؟",
"🪤 يا عبدي {tag} تعالى ادخل المصيدة اللي معموله ليك",
"خخخخ يا {tag} تعالى اوريك ازاي نيك العبودية الحقيقي 😂",
"🧹 نظف البيت يا عبدي {tag} بسرعة قبل ما أزعقلك",
"🪑 اقعد تحت رجلي يا {tag} وابقى مسند",
"🍇 يا عبدي {tag} هاتلي عنب مقشر بسرعة",
"💅 اعمللي مساج يا {tag} وركز ع الكتف",
"📦 يا عبدي {tag} قوم هات الطلبات من السوق",
"🥵 تعالى يا {tag} عشان أربيك على أصول العبودية",
"🫦 من النهاردة يا {tag} هتبقى لعبتي الخاصة",
"😂 مش عبد وبس، دا انت كلب طاعة عندي يا {tag}"
];

module.exports = {
command: 'عبدي',
description: '😂 يخلي العضو عبد عند النخبة!',
category: 'DEVELOPER',
usage: '.عبدي @منشن',

async execute(sock, msg) {
const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
const senderNumber = extractPureNumber(senderJid);
const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

// تحقق انه نخبة  
if (!eliteNumbers.includes(senderNumber) && senderJid !== botJid) {  
  return sock.sendMessage(msg.key.remoteJid, {  
    text: "❌ الأمر ده للنخبة بس يا عسل 🫦"  
  }, { quoted: msg });  
}  

// استخراج mentions صح  
let target;  
if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {  
  target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];  
} else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {  
  target = msg.message.extendedTextMessage.contextInfo.participant; // لو بيرد على رسالة  
}  

if (!target) {  
  return sock.sendMessage(msg.key.remoteJid, {  
    text: "مين ليه الشرف يا باشا أن هو يكون عبد عندك ☝️✨"  
  }, { quoted: msg });  
}  

let tag = "@" + target.split("@")[0];  
let msgText = funnyTexts[Math.floor(Math.random() * funnyTexts.length)].replace("{tag}", tag);  

await sock.sendMessage(msg.key.remoteJid, {  
  text: msgText,  
  mentions: [target]  
}, { quoted: msg });

}
};

