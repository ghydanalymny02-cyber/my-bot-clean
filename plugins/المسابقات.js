// 📁 ملف: أمر_المسابقات.js
// 🏆 نظام مسابقات تفاعلي
// 👑 بواسطة: يوميلa

const competitionsDB = {};

module.exports = {
    command: ['مسابقة', 'مسابقه', 'مسابقات', 'contest'],
    description: '🏆 إنشاء مسابقات تفاعلية',
    category: 'ترفيه',
    emoji: '🏆',
    
    async execute(sock, msg) {
        const args = msg.body.split(' ');
        const action = args[1]?.toLowerCase() || 'جديد';
        
        switch(action) {
            case 'جديد':
                await createCompetition(sock, msg, args.slice(2));
                break;
            case 'انضم':
                await joinCompetition(sock, msg, args[2]);
                break;
            case 'تصويت':
                await voteInCompetition(sock, msg, args[2], args[3]);
                break;
            case 'نتائج':
                await showResults(sock, msg, args[2]);
                break;
            case 'قائمة':
                await listCompetitions(sock, msg);
                break;
            default:
                await showCompetitionHelp(sock, msg);
        }
    }
};

async function createCompetition(sock, msg, args) {
    const chatId = msg.key.remoteJid;
    
    if (!competitionsDB[chatId]) {
        competitionsDB[chatId] = [];
    }
    
    const competitionId = 'CMP' + Date.now();
    const competition = {
        id: competitionId,
        title: args.join(' ') || 'مسابقة بدون عنوان',
        creator: msg.key.participant || msg.key.remoteJid,
        participants: [],
        votes: {},
        status: 'open',
        created: new Date().toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // تنتهي بعد 24 ساعة
    };
    
    competitionsDB[chatId].push(competition);
    
    const compText = `
🏆 *تم إنشاء مسابقة جديدة!*
══════════════════════════

🎯 *العنوان:* ${competition.title}
📅 *تنتهي:* ${competition.endTime.toLocaleString('ar-SA')}
🆔 *رقم المسابقة:* ${competitionId}

👥 *كيفية المشاركة:*
1. اكتب: مسابقة انضم ${competitionId}
2. انتظر بدء التصويت
3. شارك مع أصدقائك

⚡ *جوائز:*
🥇 الفائز الأول: 5000 💰
🥈 الثاني: 3000 💰
🥉 الثالث: 1000 💰

🚀 *ابدأ الآن!*
    `.trim();
    
    await sock.sendMessage(chatId, { 
        text: compText 
    }, { quoted: msg });
}

async function joinCompetition(sock, msg, compId) {
    const chatId = msg.key.remoteJid;
    const userId = msg.key.participant || msg.key.remoteJid;
    
    if (!competitionsDB[chatId]) {
        await sock.sendMessage(chatId, { 
            text: '❌ لا توجد مسابقات في هذه المجموعة' 
        }, { quoted: msg });
        return;
    }
    
    const competition = competitionsDB[chatId].find(c => c.id === compId);
    
    if (!competition) {
        await sock.sendMessage(chatId, { 
            text: '❌ المسابقة غير موجودة' 
        }, { quoted: msg });
        return;
    }
    
    if (competition.participants.includes(userId)) {
        await sock.sendMessage(chatId, { 
            text: '✅ أنت بالفعل مشترك في هذه المسابقة' 
        }, { quoted: msg });
        return;
    }
    
    competition.participants.push(userId);
    
    await sock.sendMessage(chatId, { 
        text: `✅ *تم انضمامك للمسابقة!*\n\n🎯 ${competition.title}\n👤 المشارك رقم: ${competition.participants.length}\n⏰ تبدأ التصويت عند اكتمال 5 مشاركين` 
    }, { quoted: msg });
    
    // بدء التصويت عند اكتمال العدد
    if (competition.participants.length >= 5 && competition.status === 'open') {
        competition.status = 'voting';
        await startVoting(sock, chatId, competition);
    }
}

async function startVoting(sock, chatId, competition) {
    const voteText = `
🗳️ *بدأ التصويت في المسابقة!*
══════════════════════════

🎯 *العنوان:* ${competition.title}
👥 *المشاركون:* ${competition.participants.length} شخص

📝 *كيفية التصويت:*
مسابقة تصويت ${competition.id} [رقم المشارك]

🎯 *المشاركون:*
${competition.participants.map((p, i) => 
    `${i + 1}. المشارك ${i + 1}`
).join('\n')}

⏰ *ينتهي التصويت بعد:* 24 ساعة
🏆 *الفائز يحصل على:* 5000 💰

⚡ *صوت الآن!*
    `.trim();
    
    await sock.sendMessage(chatId, { 
        text: voteText 
    });
    
    // جدولة إنهاء التصويت
    setTimeout(async () => {
        await endCompetition(sock, chatId, competition);
    }, 24 * 60 * 60 * 1000);
}