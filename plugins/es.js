// *حقوق مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡 🫦*
// 👑 developers_list.js - عرض مطورين البوت

module.exports = {
    command: ['مطورون'],
    description: '👑 عرض مطورين البوت مع معلوماتهم',
    category: 'مطور',
    
    async execute(sock, msg, args) {
        try {
            const chatId = msg.key.remoteJid;
            
            // قائمة المطورين مع أرقامهم
            const developers = [
                {
                    number: "+967 700  821 174",
                    name: "المطور الأول",
                    description: "سيد الأكواد ومهندس الظلال",
                    level: "🔴 رئيس المطورين"
                },
                {
                    number: "+967 715 677 073",
                    name: "المطور الثاني", 
                    description: "خبير الأنظمة وساحر الأوامر",
                    level: "🟢 نائب الرئيس"
                },
                {
                    number: "967700821174",
                    name: "مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹",
                    description: "قائد المشروع وسيد البوت",
                    level: "👑 مؤسس البوت"
                }
            ];
            
            // بناء رسالة المطورين
            let message = '👑 *مطورو بوت مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹*\n\n';
            message += '⚡ *الفريق التقني المتكامل*\n';
            message += '___________________________\n\n';
            
            // إضافة كل مطور
            developers.forEach((dev, index) => {
                message += `${index + 1}. *${dev.name}*\n`;
                message += `   📞 ${dev.number}\n`;
                message += `   📝 ${dev.description}\n`;
                message += `   🎯 ${dev.level}\n\n`;
            });
            
            message += '📌 *معلومات إضافية:*\n';
            message += '• فريق العمل على مدار الساعة\n';
            message += '• دعم فني سريع ومجاني\n';
            message += '• تحديثات مستمرة ومميزات جديدة\n';
            message += '• خصوصية وأمان تام\n\n';
            
            message += '💡 *للتواصل مع المطورين:*\n';
            message += '`.دعم` - للحصول على المساعدة\n';
            message += '`.مشكلة` - للإبلاغ عن مشكلة\n';
            message += '`.اقتراح` - لاقتراح فكرة جديدة';
            
            // إرسال الرسالة
            await sock.sendMessage(chatId, {
                text: message
            }, { quoted: msg });
            
            // إضافة رد فعل
            try {
                await sock.sendMessage(chatId, {
                    react: { text: "👑", key: msg.key }
                });
            } catch (e) {
                // تجاهل خطأ الردود
            }
            
        } catch (error) {
            console.error('❌ خطأ في عرض المطورين:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ حدث خطأ في عرض معلومات المطورين'
            });
        }
    }
};