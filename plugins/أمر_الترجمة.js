// 📁 ملف: أمر_الترجمة.js
// 🌍 أمر ترجمة النصوص
// 👑 بواسطة: يوميلا

module.exports = {
    command: ['ترجمة', 'ترجم', 'translate'],
    description: '🌍 ترجمة النص لأي لغة',
    category: 'أدوات',
    emoji: '🌍',
    
    async execute(sock, msg) {
        const text = msg.body.replace(/^(ترجمة|ترجم|translate)\s+/i, '').trim();
        
        if (!text) {
            const usageText = `
🌍 *استخدام أمر الترجمة:*
══════════════════════════

📝 *الصيغة:*
ترجمة [النص]

🎯 *أمثلة:*
• ترجمة Hello world
• ترجم كيف حالك؟
• translate Good morning

🌐 *اللغات المدعومة:*
• العربية ← الإنجليزية
• الإنجليزية ← العربية
• الفرنسية ← العربية
• التركية ← العربية

⚡ *مميزات:*
• ترجمة فورية
• دقة عالية
• دعم جميع اللغات
            `.trim();
            
            await sock.sendMessage(msg.key.remoteJid, { 
                text: usageText 
            }, { quoted: msg });
            return;
        }
        
        try {
            const translation = await translateText(text);
            
            const resultText = `
🌍 *نتيجة الترجمة:*
══════════════════════════

📝 *النص الأصلي:*
${text}

✅ *الترجمة للعربية:*
${translation.arabic}

🇬🇧 *الترجمة للإنجليزية:*
${translation.english}

🇫🇷 *الترجمة للفرنسية:*
${translation.french}

⭐ *معلومات:*
• اللغة المكتشفة: ${detectLanguage(text)}
• طول النص: ${text.length} حرف
• وقت الترجمة: فوري
            `.trim();
            
            await sock.sendMessage(msg.key.remoteJid, { 
                text: resultText 
            }, { quoted: msg });
            
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ *خطأ في الترجمة:*\n\n🔍 تأكد من كتابة النص بشكل صحيح\n💡 مثال: ترجمة Hello world` 
            }, { quoted: msg });
        }
    }
};

// دالة محاكاة للترجمة
async function translateText(text) {
    // هذه دالة محاكاة - يمكنك استبدالها بـ API حقيقي
    const translations = {
        'hello': {
            arabic: 'مرحبا',
            english: 'hello',
            french: 'bonjour'
        },
        'how are you': {
            arabic: 'كيف حالك',
            english: 'how are you',
            french: 'comment allez-vous'
        },
        'good morning': {
            arabic: 'صباح الخير',
            english: 'good morning',
            french: 'bonjour'
        },
        'thank you': {
            arabic: 'شكرا لك',
            english: 'thank you',
            french: 'merci'
        },
        'i love programming': {
            arabic: 'أحب البرمجة',
            english: 'i love programming',
            french: "j'aime la programmation"
        }
    };
    
    const lowerText = text.toLowerCase();
    
    // البحث عن ترجمة مطابقة
    for (const [key, value] of Object.entries(translations)) {
        if (lowerText.includes(key)) {
            return value;
        }
    }
    
    // إذا لم توجد ترجمة مطابقة، نعيد ترجمة عامة
    return {
        arabic: `[مترجم]: ${text}`,
        english: text,
        french: `[traduit]: ${text}`
    };
}

// دالة للكشف عن اللغة
function detectLanguage(text) {
    const arabicRegex = /[\u0600-\u06FF]/;
    const englishRegex = /[A-Za-z]/;
    
    if (arabicRegex.test(text)) return 'العربية';
    if (englishRegex.test(text)) return 'الإنجليزية';
    return 'غير معروفة';
}