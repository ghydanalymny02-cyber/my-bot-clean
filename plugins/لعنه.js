const fs = require('fs');
const path = require('path');
const protectedPath = path.join(__dirname, '..', 'data', 'protectedGroups.json');

let protectedGroups = [];
if (fs.existsSync(protectedPath)) {
    protectedGroups = JSON.parse(fs.readFileSync(protectedPath, 'utf8'));
}

let activeCurses = {};

module.exports = {
    command: 'لعنه', // تعديل من name إلى command ليتعرف عليه الهاندلر
    description: '👹 طرد عضو عشوائي كل 10 ثواني (أمر التصفية/الزرف)',
    category: 'DEVELOPER',

    async execute(sock, msg) {
        const from = msg.key.remoteJid;

        // 1. التحقق أن الأمر يتم تنفيذه داخل مجموعة
        if (!from.endsWith('@g.us')) {
            return await sock.sendMessage(from, { 
                text: "❌ هذا الأمر فقط للمجموعات." 
            }, { quoted: msg });
        }

        // 2. التحقق من حماية المجموعة
        if (protectedGroups.includes(from)) {
            return await sock.sendMessage(from, { 
                text: "🚫 هذه المجموعة محمية من الزرف.\nانسحب بهدوء." 
            }, { quoted: msg });
        }

        try {
            const metadata = await sock.groupMetadata(from);
            
            // الطريقة الحديثة والمضمونة لجلب رقم البوت بدون صيغة legacy القديمة
            const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

            let members = metadata.participants
                .filter(p => p.id !== botNumber && !p.admin) // استثناء البوت والمشرفين لحماية العملية
                .map(p => p.id);

            if (members.length === 0) {
                return await sock.sendMessage(from, { 
                    text: "❌ لا يوجد أعضاء عاديين (غير المشرفين) لأقوم بطردهم! 😈" 
                }, { quoted: msg });
            }

            // إذا كانت اللعنة شغال مسبقاً في المجموعة يتم إيقافها أولاً لتجنب التكرار
            if (activeCurses[from]) {
                clearInterval(activeCurses[from]);
            }

            await sock.sendMessage(from, { 
                text: `👹 تم إطلاق لعنة الطرش... (تصفية عشوائية)\nسأبدأ بطرد عضو كل 10 ثواني.` 
            }, { quoted: msg });

            activeCurses[from] = setInterval(async () => {
                try {
                    const updatedMeta = await sock.groupMetadata(from);
                    let newMembers = updatedMeta.participants
                        .filter(p => p.id !== botNumber && !p.admin)
                        .map(p => p.id);

                    // إذا انتهى الأعضاء يتم إيقاف التايمر فوراً
                    if (newMembers.length === 0) {
                        clearInterval(activeCurses[from]);
                        delete activeCurses[from];
                        return await sock.sendMessage(from, { text: "✅ انتهت اللعنة. تم تصفية الجميع الحين." });
                    }

                    // اختيار عضو عشوائي وطرده
                    const randomUser = newMembers[Math.floor(Math.random() * newMembers.length)];
                    await sock.groupParticipantsUpdate(from, [randomUser], "remove");
                    
                    await sock.sendMessage(from, { 
                        text: `تم طرد @${randomUser.split('@')[0]} بنجاح 😈`,
                        mentions: [randomUser]
                    });

                } catch (err) {
                    console.log("خطأ أثناء تكرار الطرد في اللعنة:", err);
                    clearInterval(activeCurses[from]);
                    delete activeCurses[from];
                }
            }, 10000); // 10 ثواني

        } catch (error) {
            console.log("خطأ في أمر لعنه:", error);
            await sock.sendMessage(from, { 
                text: `❌ تعذر بدء اللعنة (تأكد أن البوت مشرف في المجموعة): ${error.message}` 
            }, { quoted: msg });
        }
    }
};

