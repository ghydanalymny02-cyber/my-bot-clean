// 📁 ملف: أمر_الوقت.js
// 🕒 أمر عرض الوقت والتاريخ
// 👑 بواسطة: يوميلا

module.exports = {
    command: ['الوقت', 'التاريخ', 'الساعة'],
    description: '🕒 عرض الوقت والتاريخ الحالي',
    category: 'عام',
    emoji: '🕒',
    
    async execute(sock, msg) {
        const now = new Date();
        
        const timeText = `
🕒 *الوقت الحالي:*
• التوقيت: ${now.toLocaleTimeString('ar-SA')}
• التاريخ الميلادي: ${now.toLocaleDateString('ar-SA')}
• اليوم: ${getArabicDay(now.getDay())}

📅 *التفاصيل:*
• الشهر: ${getArabicMonth(now.getMonth())}
• السنة: ${now.getFullYear()} ميلادية
• الأسبوع: الأسبوع ${getWeekNumber(now)} من السنة

🌍 *توقيتات عالمية:*
• مكة: ${getMakkahTime()}
• القاهرة: ${getCairoTime()}
• دبي: ${getDubaiTime()}
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { 
            text: timeText 
        }, { quoted: msg });
    }
};

// دالة للحصول على اليوم بالعربي
function getArabicDay(dayIndex) {
    const days = [
        'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء',
        'الخميس', 'الجمعة', 'السبت'
    ];
    return days[dayIndex];
}

// دالة للحصول على الشهر بالعربي
function getArabicMonth(monthIndex) {
    const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل',
        'مايو', 'يونيو', 'يوليو', 'أغسطس',
        'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return months[monthIndex];
}

// دالة للحصول على توقيت مكة
function getMakkahTime() {
    const now = new Date();
    now.setHours(now.getHours() + 3); // توقيت مكة +3
    return now.toLocaleTimeString('ar-SA');
}

// دالة للحصول على توقيت القاهرة
function getCairoTime() {
    const now = new Date();
    now.setHours(now.getHours() + 2); // توقيت القاهرة +2
    return now.toLocaleTimeString('ar-SA');
}

// دالة للحصول على توقيت دبي
function getDubaiTime() {
    const now = new Date();
    now.setHours(now.getHours() + 4); // توقيت دبي +4
    return now.toLocaleTimeString('ar-SA');
}

// دالة للحصول على رقم الأسبوع
function getWeekNumber(date) {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - firstDay) / 86400000;
    return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}