// *حقوق مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🫦*
// 📄 *خروج.js* (أمر الخروج من المجموعات)

const {
    isElite,
    extractPureNumber
} = require('../haykala/elite');

module.exports = {
    command: 'خروج',
    description: 'الخروج من جميع المجموعات ما عدا مجموعات المالك',
    usage: '.خروج تأكيد',
    category: 'admin',

    async execute(sock, msg) {
        const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
        const senderNumber = extractPureNumber(senderJid);  
        const reply = (text) => sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });

        // رقم المالك الأساسي لبوت مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 (بدون + وبدون مسافات)
        const ownerNumber = '963996097873'; // +967 715 677 073 بدون المسافات والإشارة
        
        // التحقق إذا كان الشخص من النخبة أو المالك
        if (!isElite(senderNumber) && senderNumber !== ownerNumber) {
            return reply(`╔══ ❌ ══╗\nهذا الأمر مخصص للنخبة فقط.\n╚══ ❌ ══╝\n\n👑 *حقوق YUMILA*`);
        }

        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        const parts = text.trim().split(/\s+/);
        const action = parts[1];

        // التأكد من كتابة "تأكيد"
        if (action !== 'تأكيد') {
            return reply(`╔══ ⚠️ ══╗\n*تنبيه:* هذا الأمر سيخرج البوت من *كل* المجموعات\n*ما عدا* المجموعات التي منشئها المالك:\n${ownerNumber}\n\nللتأكيد اكتب: .خروج تأكيد\n╚══ ⚠️ ══╝\n\n👑 *حقوق مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹*`);
        }

        await reply(`🔍 جاري البحث عن المجموعات...\n👑 *حقوق مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹*`);

        try {
            // جلب كل المجموعات
            const groups = await sock.groupFetchAllParticipating();
            const groupIds = Object.keys(groups);
            
            let keptCount = 0;  // مجموعات المالك (لن نخرج منها)
            let leftCount = 0;  // مجموعات غير المالك (سنخرج منها)
            let errorCount = 0;
            
            await reply(`📊 تم العثور على ${groupIds.length} مجموعة\n🚪 جاري الخروج من مجموعات غير المالك...`);

            for (const groupId of groupIds) {
                try {
                    const groupMetadata = groups[groupId];
                    
                    // التحقق من منشئ المجموعة
                    // بعض المجموعات قد لا يكون لها منشئ واضح
                    let groupCreator = null;
                    if (groupMetadata.owner) {
                        groupCreator = groupMetadata.owner.split('@')[0];
                    }
                    
                    // طباعة للتصحيح (في الكونسول)
                    console.log(`🔍 مجموعة: ${groupMetadata.subject}`);
                    console.log(`👑 منشئها: ${groupCreator || 'غير معروف'}`);
                    console.log(`📱 المالك: ${ownerNumber}`);
                    
                    // التحقق: إذا كان منشئ المجموعة هو المالك، ابقى فيها
                    if (groupCreator === ownerNumber) {
                        console.log(`✅ البقاء في مجموعة المالك: ${groupMetadata.subject}`);
                        keptCount++;
                    } else {
                        // الخروج من المجموعة (لأن منشئها ليس المالك)
                        console.log(`🚪 الخروج من: ${groupMetadata.subject}`);
                        await sock.groupLeave(groupId);
                        leftCount++;
                        
                        // تأخير بسيط
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    }
                    
                } catch (groupError) {
                    console.error(`❌ خطأ في مجموعة: ${groupId}`, groupError.message);
                    errorCount++;
                    
                    // في حالة الخطأ، نحاول الخروج منها كحل احتياطي
                    try {
                        await sock.groupLeave(groupId);
                        leftCount++;
                    } catch (e) {
                        errorCount++;
                    }
                }
            }

            // تقرير نهائي
            const report = `
╔══════════════════════════════╗
║    تقرير الخروج من المجموعات   ║
╠══════════════════════════════╣
║ إجمالي المجموعات: ${groupIds.length}          ║
║ مجموعات المالك (لم نخرج): ${keptCount}            ║
║ مجموعات غير المالك (خرجنا): ${leftCount}            ║
║ مجموعات بها أخطاء: ${errorCount}           ║
╚══════════════════════════════╝
✅ *تم الحفاظ على مجموعات المالك ${ownerNumber}*
👑 *حقوق مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹*
            `;
            
            await reply(report);

        } catch (error) {
            console.error('💥 خطأ كبير:', error);
            await reply(`❌ حدث خطأ: ${error.message}\n👑 *حقوق YUMILA*`);
        }
    }
};