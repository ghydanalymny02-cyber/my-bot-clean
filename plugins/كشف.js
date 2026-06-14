const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'كشف', // تعديل الاسم إلى command ليتعرف عليه الهاندلر
    description: '🔍 كشف الأعضاء المشبوهين والأرقام الغريبة في المجموعة',
    category: 'عام',

    async execute(sock, msg) {
        const from = msg.key.remoteJid;

        // التحقق أن الأمر يتم تنفيذه داخل مجموعة
        if (!from.endsWith('@g.us')) {
            return await sock.sendMessage(from, { 
                text: "❌ هذا الأمر يعمل فقط داخل المجموعات." 
            }, { quoted: msg });
        }

        try {
            // جلب بيانات المجموعة وأعضائها
            const group = await sock.groupMetadata(from);
            const members = group.participants;

            let suspicious = [];

            for (const member of members) {
                const id = member.id;
                const num = id.split('@')[0];

                // 1. فحص إذا كان المعرف يحتوي على علامات البوتات
                if (id.includes(':') || id.includes('.bot')) {
                    suspicious.push(`${num} — مشتبه أنه بوت 🤖`);
                    continue;
                }

                // 2. فحص الأرقام الأجنبية (تعديل طفيف ليناسب فحص الأرقام غير المصرية/العربية حسب رغبتك الأصلية)
                if (!num.startsWith('20') && !num.startsWith('967')) { 
                    suspicious.push(`${num} — رقم غريب/أجنبي 🌍`);
                    continue;
                }

                // 3. فحص الحسابات التي لا تملك صورة بروفايل علنية
                try {
                    await sock.profilePictureUrl(id, 'image');
                } catch {
                    suspicious.push(`${num} — بدون صورة شخصية 🚫`);
                }
            }

            // إذا كانت المجموعة سليمة
            if (suspicious.length === 0) {
                return await sock.sendMessage(from, { 
                    text: "✅ لا يوجد أعضاء مشبوهين في هذه المجموعة." 
                }, { quoted: msg });
            }

            // بناء نص التقرير
            const reportMessage = `📍 *تقرير كشف أعضاء المجموعة:*\n\n` +
                                  suspicious.map((s, i) => `${i + 1}. ${s}`).join("\n") +
                                  `\n\n⚠️ راقب الأرقام المذكورة أعلاه بدقة.`;

            // إرسال النتيجة للمجموعة
            await sock.sendMessage(from, { text: reportMessage }, { quoted: msg });

        } catch (error) {
            console.log("خطأ في أمر كشف:", error);
            await sock.sendMessage(from, { 
                text: `❌ حدث خطأ أثناء فحص المجموعة: ${error.message}` 
            }, { quoted: msg });
        }
    }
};

