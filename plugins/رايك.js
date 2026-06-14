const opinions = [
"رايي انه ممتاز 👍",
"ممكن يحتاج تحسين شوي 🤔",
"ما أعتقد انه فكرة جيدة 😕",
"وايد حلو وماشي الحال 🔥",
"حاول مرة ثانية يمكن تتحسن 🤨",
"أعتقد انه ممتاز جداً 👌",
"مبهم شوي، وضح أكثر 🙃",
"فكرة جديدة وابداعية 👏",
"هذا الكلام يحتاج إعادة نظر 😐",
"مقنع وأعجبني 👍",
"فكرة رهيبة! 😎",
"ممكن نطورها أكتر 💡",
"مش واضحة الفكرة كويس 🧐",
"جميل جدًا لكن يحتاج توضيح 📝",
"دا ممتاز جدًا 👏👏",
"جربها تاني يمكن تتحسن 💪",
"مش عارف، ممكن توضح أكتر 🤔",
"رايي انه ممكن ينجح 🔥",
"فكرة مختلفة وشيقة 😍",
"حلو جدًا ومافيش كلام 💯",
"أحتاج أعرف تفاصيل أكتر 📌",
"رايي انه محتاج تعديل بسيط ✏️",
"شيء ممتع وجديد 👍",
"مثير للاهتمام 👀",
"يمكن يكون ممتاز لو اتنفذ صح ⚡",
"فكرة مبتكرة 😎",
"كويس لكن ممكن أحسن شوي 😅",
"ممكن نحسن الصياغة شوي 📝",
"دا شيء رائع 👏",
"ممكن نعدل شوية ونزبطه 🔧",
"حلو جدًا ومقنع 💡",
];

module.exports = {
category: 'ترفيه',
command: 'رايك',
description: 'يعطيك رأي عشوائي بالنص أو بالرد على الرسائل المختلفة',
async execute(sock, msg) {
const from = msg.key.remoteJid;
try {
console.log('🔹 استلام أمر شرايك');

let text = '';
let isText = true;

const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
const isReply = !!quoted;

if (isReply) {
    if (quoted.conversation || quoted.extendedTextMessage?.text) {
        text = quoted.conversation || quoted.extendedTextMessage.text;
    } else {
        isText = false;
    }
} else {
    text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
}

// إزالة أمر .رايك لو موجود
text = text.replace(/^\.رايك\s*/i, '').trim();

if (!text && isText) {
    console.log('⚠️ لا يوجد نص لإعطاء رأي عليه');
    return await sock.sendMessage(from, { text: 'اكتب بعد الأمر كلام أو رد على رسالة عشان أعطيك رأيي.' }, { quoted: msg });
}

const opinion = opinions[Math.floor(Math.random() * opinions.length)];

if (isText) {
    await sock.sendMessage(from, { text: `📢 رأيي في كلامك:\n\n"${text}"\n\n${opinion}` }, { quoted: msg });
} else {
    await sock.sendMessage(from, { text: opinion }, { quoted: msg });
}

console.log('🔹 إرسال الرأي:', opinion);

} catch (error) {
  console.error('❌ خطأ في أمر شرايك:', error);
  await sock.sendMessage(from, { text: `❌ حدث خطأ أثناء تنفيذ الأمر: ${error.message || error.toString()}` }, { quoted: msg });
}
},
};
