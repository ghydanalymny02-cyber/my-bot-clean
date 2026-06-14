// 📁 ملف: أمر_تحدي.js
// 🏆 تحديات ممتعة
// 👑 بواسطة: يوميلا

module.exports = {
    command: ['تحدي', 'تحديات', 'challenge'],
    description: '🏆 تحديات مسلية بين الأعضاء',
    category: 'ترفيه',
    emoji: '🏆',
    
    async execute(sock, msg) {
        const args = msg.body.split(' ');
        const challengeType = args[1] || 'عشوائي';
        
        if (!args[1]) {
            const challengesList = `
🏆 *أنواع التحديات:*
══════════════════════════

🎭 *تحدي عشوائي:* تحديات متنوعة
🎮 *تحدي ألعاب:* ألعاب سريعة
🧠 *تحدي ذكاء:* أسئلة ذكاء
🎨 *تحدي إبداعي:* مهام إبداعية
😂 *تحدي مضحك:* تحديات مضحكة

📝 *الصيغة:*
تحدي [نوع التحدي]

🎯 *أمثلة:*
• تحدي عشوائي
• تحديات ألعاب
• challenge ذكاء

⚡ *مميزات:*
• تحديات متنوعة
• وقت محدد
• نقاط وجوائز
• متعة وتسلية
            `.trim();
            
            await sock.sendMessage(msg.key.remoteJid, { 
                text: challengesList 
            }, { quoted: msg });
            return;
        }
        
        const challenge = getChallenge(challengeType);
        
        const challengeText = `
🏆 *تحدي جديد!*
══════════════════════════

🎯 *نوع التحدي:* ${challenge.type}
⭐ *الصعوبة:* ${challenge.difficulty}
⏰ *الوقت:* ${challenge.time}
🎭 *الفئة:* ${challenge.category}

📝 *التحدي:*
${challenge.description}

🎮 *كيفية اللعب:*
${challenge.howToPlay}

🏅 *الجوائز:*
${challenge.rewards}

📊 *قواعد التحدي:*
${challenge.rules}

🚀 *ابدأ الآن!*
اكتب "اكملت" عند الانتهاء
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { 
            text: challengeText 
        }, { quoted: msg });
    }
};

// دالة للحصول على تحديات
function getChallenge(type) {
    const challenges = {
        'عشوائي': {
            type: 'عشوائي',
            difficulty: 'متوسط ⭐⭐⭐',
            time: '5 دقائق',
            category: 'متنوع',
            description: 'اذكر 10 أسماء تبدأ بحرف "م" خلال دقيقة واحدة!',
            howToPlay: '1. جهز ورقة وقلم\n2. عداد الوقت: 60 ثانية\n3. اكتب أكبر عدد ممكن',
            rewards: '🏅 100 نقطة\n⭐ لقب "سريع البديهة"\n🎭 متعة لا تنتهي',
            rules: '• لا تستخدم الإنترنت\n• لا تسأل أحداً\n• كن صادقاً مع نفسك'
        },
        'ألعاب': {
            type: 'ألعاب',
            difficulty: 'سهل ⭐⭐',
            time: '3 دقائق',
            category: 'تسلية',
            description: 'ارسم شيئاً بدون أن يستطيع الآخرون معرفته!',
            howToPlay: '1. اختر شيئاً لرسمه\n2. ارسمه في تطبيق الرسم\n3. أرسل الرسم',
            rewards: '🏅 50 نقطة\n🎨 لقب "الفنان"\n😂 ضحك جميل',
            rules: '• لا ترسم أشخاصاً حقيقيين\n• استخدم خيالك\n• كن مبدعاً'
        },
        'ذكاء': {
            type: 'ذكاء',
            difficulty: 'صعب ⭐⭐⭐⭐',
            time: '10 دقائق',
            category: 'تفكير',
            description: 'حل هذا اللغز: "أخوك وليس بأخيك، ابن عمك وليس بابن عمك، فمن هو؟"',
            howToPlay: '1. فكر جيداً في اللغز\n2. ابحث عن الإجابة المنطقية\n3. اكتب الإجابة',
            rewards: '🏅 150 نقطة\n🧠 لقب "العبقري"\n📚 معرفة جديدة',
            rules: '• لا تبحث في الإنترنت\n• استخدم المنطق فقط\n• فكر خارج الصندوق'
        },
        'إبداعي': {
            type: 'إبداعي',
            difficulty: 'متوسط ⭐⭐⭐',
            time: '7 دقائق',
            category: 'إبداع',
            description: 'اكتب قصة قصيرة في 5 أسطر عن بطل خارق اسمه "يوميلا"!',
            howToPlay: '1. فكر في قصة مميزة\n2. اكتب 5 أسطر\n3. أضف عنصراً مضحكاً',
            rewards: '🏅 120 نقطة\n✍️ لقب "الكاتب"\n📖 قصة تخلد في الذاكرة',
            rules: '• لا تنسخ من الإنترنت\n• كن مبدعاً\n• أضف لمسة فكاهية'
        },
        'مضحك': {
            type: 'مضحك',
            difficulty: 'سهل ⭐',
            time: '2 دقيقة',
            category: 'ضحك',
            description: 'قل نكتة مضحكة تجعل الجميع يضحكون!',
            howToPlay: '1. تذكر نكتة مضحكة\n2. اكتبها بأسلوبك\n3. أرسلها للجميع',
            rewards: '🏅 30 نقطة\n😂 لقب "مضحك الدار"\n🎉 جو من المرح',
            rules: '• النكتة يجب أن تكون أصلية\n• لا تكن جارحاً\n• اجعلها مناسبة'
        }
    };
    
    return challenges[type] || challenges['عشوائي'];
}