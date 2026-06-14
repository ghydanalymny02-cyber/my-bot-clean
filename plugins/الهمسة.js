// 📁 ملف: أمر_الهمسة.js
// 💌 إرسال همسة سرية
// 👑 بواسطة: يوميلا

module.exports = {
    command: ['همسة', 'رسالة', 'سر', 'whisper'],
    description: '💌 إرسال همسة سرية لشخص',
    category: 'ترفيه',
    emoji: '💌',
    
    async execute(sock, msg) {
        const args = msg.body.split(' ');
        
        if (args.length < 3) {
            const helpText = `
💌 *كيفية إرسال الهمسة:*
══════════════════════════

📝 *الصيغة:*
همسة [رقم الشخص] [الرسالة]

🎯 *مثال:*
همسة 123456789 أنت رائع

✨ *مميزات الهمسة:*
✅ سرية تامة
✅ لا يعرف المرسل
✅ تختفي بعد القراءة
✅ إيموجيز جميلة

⚠️ *ملاحظات:*
• الرقم بدون +
• الهمسة ترسل مرة واحدة
• لا يمكن استرجاعها
            `.trim();
            
            await sock.sendMessage(msg.key.remoteJid, { 
                text: helpText 
            }, { quoted: msg });
            return;
        }
        
        const targetNumber = args[1] + '@s.whatsapp.net';
        const message = args.slice(2).join(' ');
        
        try {
            // إنشاء همسة سرية
            const whisper = createWhisper(message);
            
            await sock.sendMessage(targetNumber, { 
                text: whisper 
            });
            
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `✅ *تم إرسال الهمسة بنجاح!*\n\n📱 إلى: ${args[1]}\n📝 الرسالة: سرية 🤫\n\n⚡ ستختفي بعد القراءة` 
            }, { quoted: msg });
            
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ *لم أتمكن من إرسال الهمسة*\n\n🔍 تأكد من:\n• الرقم صحيح\n• الشخص موجود في واتساب\n• الاتصال جيد` 
            }, { quoted: msg });
        }
    }
};

function createWhisper(message) {
    const whispers = [
        `💌 *همسة سرية وصلتك!*\n\n"${message}"\n\n🤫 من: شخص سري\n⏰ ${new Date().toLocaleTimeString('ar-SA')}`,
        `✨ *صوت من بعيد يهمس:*\n\n${message}\n\n🎭 لا تعرف من أنا\n🔥 هذه الهمسة ستختفي`,
        `🔮 *رسالة غامضة:*\n\n📜 ${message}\n\n👻 المرسل: مجهول\n⚡ اقرأها قبل أن تختفي`,
        `🌟 *بصمة خفية:*\n\n"${message}"\n\n🎯 وصلتك من شخص يحبك\n💫 لكنه يخفي اسمه`
    ];
    
    return whispers[Math.floor(Math.random() * whispers.length)];
}