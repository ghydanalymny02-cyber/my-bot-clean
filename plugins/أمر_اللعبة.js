// 📁 ملف: أمر_اللعبة.js
// 🎯 لعبة كلمة السر
// 👑 بواسطة: يوميلا

// تخزين جلسات الألعاب
const gameSessions = new Map();

module.exports = {
    command: ['كت', 'كلمه', 'لعبه', 'لعبة'],
    description: '🎯 لعبة تخمين كلمة السر',
    category: 'ترفيه',
    emoji: '🎯',
    
    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const userId = msg.key.participant || msg.key.remoteJid;
        
        // التحقق من وجود لعبة نشطة
        if (gameSessions.has(chatId)) {
            await handleGameInput(sock, msg, chatId, userId);
            return;
        }
        
        // بدء لعبة جديدة
        await startNewGame(sock, msg, chatId);
    }
};

// بدء لعبة جديدة
async function startNewGame(sock, msg, chatId) {
    const words = [
        {
            word: "قهوة",
            hint: "☕ مشروب ساخن مفضل في الصباح",
            category: "مشروبات"
        },
        {
            word: "واتساب",
            hint: "📱 تطبيق مراسلة فورية",
            category: "تطبيقات"
        },
        {
            word: "يوميلا",
            hint: "👑 مطورة البوت الأسطورية",
            category: "أشخاص"
        },
        {
            word: "برمجة",
            hint: "💻 كتابة الأكواد والتطبيقات",
            category: "تقنية"
        },
        {
            word: "شمس",
            hint: "☀️ نجمة في وسط المجموعة الشمسية",
            category: "فضاء"
        },
        {
            word: "كتاب",
            hint: "📚 يحتوي على صفحات ومعلومات",
            category: "أدوات"
        },
        {
            word: "سفر",
            hint: "✈️ الانتقال من مكان لآخر",
            category: "أنشطة"
        },
        {
            word: "مدرسة",
            hint: "🏫 مكان للتعليم والتعلم",
            category: "أماكن"
        }
    ];
    
    const selected = words[Math.floor(Math.random() * words.length)];
    const hiddenWord = '_ '.repeat(selected.word.length).trim();
    
    const gameSession = {
        word: selected.word.toLowerCase(),
        hidden: hiddenWord.split(' '),
        attempts: 6,
        guessedLetters: new Set(),
        startTime: new Date(),
        players: new Set()
    };
    
    gameSessions.set(chatId, gameSession);
    
    const gameText = `
🎯 *لعبة كلمة السر*
══════════════════════════

📝 *الكلمة:* ${gameSession.hidden.join(' ')}
💡 *التلميح:* ${selected.hint}
🏷️ *التصنيف:* ${selected.category}

📊 *المعلومات:*
• الحروف: ${selected.word.length}
• المحاولات: 6
• الوقت: غير محدد

🎮 *كيفية اللعب:*
1. اكتب حرفاً واحداً فقط
2. إذا كان الحرف صحيحاً، سيظهر مكانه
3. إذا كان خطأ، تخسر محاولة
4. اكتب "استسلم" للخروج

🚀 *ابدأ الآن!*
أول حرف؟
        `.trim();
        
        await sock.sendMessage(chatId, { 
            text: gameText 
        }, { quoted: msg });
}

// معالجة إدخال اللعبة
async function handleGameInput(sock, msg, chatId, userId) {
    const session = gameSessions.get(chatId);
    const input = msg.body.toLowerCase().trim();
    
    // إضافة اللاعب
    session.players.add(userId);
    
    // الخروج من اللعبة
    if (input === 'استسلم' || input === 'exit' || input === 'خروج') {
        gameSessions.delete(chatId);
        await sock.sendMessage(chatId, { 
            text: `🎮 *انتهت اللعبة!*\n\nالكلمة كانت: *${session.word}*\n\n🔄 اكتب "كت" للعب مرة أخرى!` 
        }, { quoted: msg });
        return;
    }
    
    // التحقق من المدخل
    if (input.length !== 1 || !/[\u0600-\u06FFa-z]/.test(input)) {
        await sock.sendMessage(chatId, { 
            text: `❌ *خطأ في الإدخال!*\n\n📝 أدخل حرفاً واحداً فقط (أ-ي أو a-z)\n🔍 مثال: "أ" أو "b"` 
        }, { quoted: msg });
        return;
    }
    
    // التحقق من تكرار الحرف
    if (session.guessedLetters.has(input)) {
        await sock.sendMessage(chatId, { 
            text: `⚠️ *هذا الحرف سبق تخمينه!*\n\n🔤 الحروف التي جربتها:\n${Array.from(session.guessedLetters).join(', ')}` 
        }, { quoted: msg });
        return;
    }
    
    // إضافة الحرف إلى المجموعة
    session.guessedLetters.add(input);
    
    // التحقق من صحة الحرف
    const wordArray = session.word.split('');
    let correctGuess = false;
    
    for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i] === input) {
            session.hidden[i] = input;
            correctGuess = true;
        }
    }
    
    // إذا كان التخمين خاطئاً
    if (!correctGuess) {
        session.attempts--;
    }
    
    // التحقق من الفوز
    if (!session.hidden.includes('_')) {
        const timeSpent = Math.floor((new Date() - session.startTime) / 1000);
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        
        gameSessions.delete(chatId);
        
        await sock.sendMessage(chatId, { 
            text: `🎉 *مبروك! فزت!* 🎉\n\n✅ الكلمة: *${session.word}*\n⏰ الوقت: ${minutes} د ${seconds} ث\n🎯 المحاولات المتبقية: ${session.attempts}\n👥 اللاعبين: ${session.players.size}\n\n🏆 *مستوى: ${getPerformanceLevel(session.attempts)}*\n🔄 اكتب "كت" للعب مرة أخرى!` 
        }, { quoted: msg });
        return;
    }
    
    // التحقق من الخسارة
    if (session.attempts <= 0) {
        gameSessions.delete(chatId);
        
        await sock.sendMessage(chatId, { 
            text: `💀 *انتهت المحاولات!*\n\n❌ الكلمة كانت: *${session.word}*\n🔤 الحروف التي جربتها: ${Array.from(session.guessedLetters).join(', ')}\n\n💡 *نصيحة:* حاول في المرة القادمة!\n🔄 اكتب "كت" للعب مرة أخرى!` 
        }, { quoted: msg });
        return;
    }
    
    // تحديث حالة اللعبة
    const progress = session.hidden.join(' ');
    const hangman = drawHangman(session.attempts);
    
    const updateText = `
🎯 *جولة جديدة*
══════════════════════════

📝 *الكلمة:* ${progress}
${hangman}

📊 *المعلومات:*
• المحاولات المتبقية: ${session.attempts}
• الحروف المجربة: ${Array.from(session.guessedLetters).join(', ')}
• اللاعبين النشطين: ${session.players.size}

${correctGuess ? '✅ *حرف صحيح!*' : '❌ *حرف خاطئ!*'}

🎮 *التخمين القادم؟*
        `.trim();
        
        await sock.sendMessage(chatId, { 
            text: updateText 
        }, { quoted: msg });
}

// رسم رجل المشنقة
function drawHangman(attempts) {
    const stages = [
        `
  +---+
  |   |
      |
      |
      |
      |
=========`,
        `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
        `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
        `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
        `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
        `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
        `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
    ];
    
    return stages[6 - attempts];
}

// تحديد مستوى الأداء
function getPerformanceLevel(attempts) {
    if (attempts >= 5) return 'ممتاز ⭐⭐⭐⭐⭐';
    if (attempts >= 4) return 'جيد جداً ⭐⭐⭐⭐';
    if (attempts >= 3) return 'جيد ⭐⭐⭐';
    if (attempts >= 2) return 'مقبول ⭐⭐';
    return 'مبتدئ ⭐';
}