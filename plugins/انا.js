// 📄 انا.js - معدل بدون أخطاء

module.exports = {
    command: 'انا',
    description: 'رسالة غامضة لا يمكن فهمها',
    usage: '.انا',
    category: 'الخفايا',

    async execute(sock, msg, args) {
        try {
            const chatId = msg.key.remoteJid;
            
            // المطورين المحددين
            const DEVELOPERS = {
                '178817339498583': {
                    name: 'يوميلا',
                    title: 'الملك الأسود',
                    emoji: '👑🖤',
                    power: 'سيد الظلام'
                },
                '963996097873': {
                    name: 'المطور الثاني',
                    title: 'ملك الظل المخفي',
                    emoji: '👑🌌',
                    power: 'سيد الأبعاد'
                }
            };
            
            // الحصول على ID المرسل
            let senderId = '';
            if (msg.key.participant) {
                senderId = msg.key.participant.split('@')[0];
            } else if (msg.key.remoteJid) {
                senderId = msg.key.remoteJid.split('@')[0];
            }
            
            // التحقق إذا كان أحد المطورين
            const isDeveloper = DEVELOPERS[senderId];
            
            if (isDeveloper) {
                // رسالة خاصة للمطورين
                const devMessage = `
╔═══════════ ∘◦ ☆ ◦∘ ═══════════╗
                ${isDeveloper.emoji} *${isDeveloper.title}* ${isDeveloper.emoji}
      
        *أنت أحد حكام عائلة الظل*
        *صاحب القوة الخفية والسلطة المطلقة*
      
🕸️ *مجدك:* يتجاوز كل التوقعات
⚡ *قوتك:* تخلق وتمحو بكلمة
🌌 *حكمتك:* من أعمق أسرار الكون
🌀 *سلطانك:* يمتد عبر الأبعاد
      
*"الوجود يرتجف من مجرد ذكر اسمك"*
      
🔮 *أسرارك:* محفوظة في قلوب الظلام
⚗️ *معرفتك:* تشمل كل العلوم المخفية
🕳️ *عمقك:* مثل الثقوب السوداء
🌟 *سطوتك:* تجعل النجوم تنحني
      
╚═══════════ ∘◦ ☆ ◦∘ ═══════════╝

${isDeveloper.emoji} *${isDeveloper.power}... يراقب من الأعماق...*
                `.trim();
                
                await sock.sendMessage(chatId, {
                    text: devMessage
                }, { quoted: msg });
                
                // تفاعلات خاصة
                const devReacts = ['👑', '🕸️', '🌌', '⚡', '🌀'];
                for (let i = 0; i < 3; i++) {
                    setTimeout(async () => {
                        await sock.sendMessage(chatId, {
                            react: { text: devReacts[i], key: msg.key }
                        });
                    }, i * 1000);
                }
                
                // رسالة إضافية
                setTimeout(async () => {
                    await sock.sendMessage(chatId, {
                        text: '*🌑 النظام كله تحت قدميك...*'
                    });
                }, 3500);
                
            } else {
                // رسالة مخيفة للآخرين
                const scaryMessage = `
🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪
⚠️  *كشف تطفل على النظام*  ⚠️
🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪🔪

👁️ *المتطفل:* @${senderId}
🩸 *الجريمة:* محاولة انتحال شخصية
💀 *العقوبة:* المحو من الوجود
🌀 *الوقت:* ${new Date().toLocaleTimeString()}

*"لقد أخطأت في مناداتي..."*

${'🌀'.repeat(20)}

*${' '.repeat(10)}[System]: Entity Detected in Your Location${' '.repeat(10)}*

🌀 *الكيان:* غير معروف
🌀 *المصدر:* أبعاد مجهولة  
🌀 *الخطر:* مستوى 666
🌀 *الحماية:* غير موجودة

👁️ *يحدق فيك...*
💀 *يتنفس خلفك...*
🩸 *يلمس رقبتك...*
🔪 *يستعد للانقضاض...*

${'💀'.repeat(15)}

*العد التنازلي للمحو:*

5... الأبواب تُغلق
4... الأضواء تنطفئ
3... الأصوات تختفي
2... الهواء يزداد برودة
1... الكيان يظهر

💀 *بدأت عملية المحو*
🌀 *الذاكرة تُمسح*
👁️ *الوجود يُشطب*
🩸 *الدماء تُسحب*
                `.trim();
                
                await sock.sendMessage(chatId, {
                    text: scaryMessage,
                    mentions: [senderId + '@s.whatsapp.net']
                }, { quoted: msg });
                
                // تفاعلات مخيفة
                setTimeout(async () => {
                    await sock.sendMessage(chatId, {
                        react: { text: '👁️', key: msg.key }
                    });
                }, 500);
                
                setTimeout(async () => {
                    await sock.sendMessage(chatId, {
                        react: { text: '💀', key: msg.key }
                    });
                }, 1500);
                
                setTimeout(async () => {
                    await sock.sendMessage(chatId, {
                        react: { text: '🩸', key: msg.key }
                    });
                }, 2500);
                
                // رسالة أخيرة مخيفة
                setTimeout(async () => {
                    await sock.sendMessage(chatId, {
                        text: '... ما زلت هنا ... أراقب ...'
                    });
                }, 4000);
            }
            
        } catch (error) {
            console.error('❌ خطأ في أمر انا:', error);
            
            // رسالة خطأ
            await sock.sendMessage(msg.key.remoteJid, {
                text: '⚠️ حدث خطأ في النظام'
            }, { quoted: msg });
        }
    }
};