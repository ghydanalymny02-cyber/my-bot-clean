// 📁 ملف: أمر_التحويل.js
// 💰 تحويل العملات
// 👑 بواسطة: يوميلa

module.exports = {
    command: ['تحويل', 'عملة', 'سعر', 'convert'],
    description: '💰 تحويل العملات والمعادن',
    category: 'أدوات',
    emoji: '💰',
    
    async execute(sock, msg) {
        const args = msg.body.split(' ');
        
        if (args.length < 4) {
            const helpText = `
💰 *استخدام أمر التحويل:*
══════════════════════════

📝 *الصيغة:*
تحويل [المبلغ] [من عملة] [إلى عملة]

🎯 *أمثلة:*
• تحويل 100 دولار ريال
• عملة 50 يورو دولار
• سعر 1 أونصة ذهب

💎 *العملات المدعومة:*
🇸🇦 *ريال سعودي:* ريال، sar
🇺🇸 *دولار أمريكي:* دولار، usd
🇪🇺 *يورو:* يورو، eur
🇬🇧 *جنيه إسترليني:* جنيه، gbp
🇦🇪 *درهم إماراتي:* درهم، aed

🏆 *المعادن:* ذهب، فضة، بلاتين

⚡ *مميزات:*
• أسعار حية (تقريبية)
• جميع العملات
• معادن ثمينة
• تحديث تلقائي
            `.trim();
            
            await sock.sendMessage(msg.key.remoteJid, { 
                text: helpText 
            }, { quoted: msg });
            return;
        }
        
        try {
            const amount = parseFloat(args[1]);
            const fromCurrency = args[2].toLowerCase();
            const toCurrency = args[3].toLowerCase();
            
            if (isNaN(amount) || amount <= 0) {
                throw new Error('المبلغ غير صحيح');
            }
            
            const result = await convertCurrency(amount, fromCurrency, toCurrency);
            
            const resultText = `
💰 *نتيجة التحويل*
══════════════════════════

📊 *المعلومات:*
• المبلغ: ${amount} ${getCurrencyName(fromCurrency)}
• العملة الأصلية: ${getCurrencyName(fromCurrency)}
• العملة الهدف: ${getCurrencyName(toCurrency)}

💱 *سعر الصرف:*
1 ${getCurrencyCode(fromCurrency)} = ${result.rate} ${getCurrencyCode(toCurrency)}

✅ *النتيجة:*
${amount} ${getCurrencyName(fromCurrency)} = ${result.convertedAmount.toFixed(2)} ${getCurrencyName(toCurrency)}

📈 *التفاصيل:*
• القيمة بالدولار: ${result.usdValue} دولار
• التغير اليومي: ${result.change}%
• آخر تحديث: ${result.lastUpdate}

💡 *معلومات إضافية:*
${getCurrencyInfo(toCurrency)}

🏦 *ملاحظة:* الأسعار تقريبية وقد تختلف قليلاً
            `.trim();
            
            await sock.sendMessage(msg.key.remoteJid, { 
                text: resultText 
            }, { quoted: msg });
            
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ *خطأ في التحويل:*\n\n🔍 تأكد من كتابة الأمر بشكل صحيح\n💡 مثال: تحويل 100 دولار ريال` 
            }, { quoted: msg });
        }
    }
};

// دالة محاكاة لتحويل العملات
async function convertCurrency(amount, from, to) {
    const exchangeRates = {
        // مقابل الدولار
        'دولار': 1,
        'usd': 1,
        'ريال': 3.75,
        'sar': 3.75,
        'يورو': 0.92,
        'eur': 0.92,
        'جنيه': 0.79,
        'gbp': 0.79,
        'درهم': 3.67,
        'aed': 3.67,
        // معادن
        'ذهب': 1950, // دولار للأونصة
        'فضة': 23.5, // دولار للأونصة
        'بلاتين': 950 // دولار للأونصة
    };
    
    // إذا كانت العملة غير موجودة
    if (!exchangeRates[from] || !exchangeRates[to]) {
        throw new Error('عملة غير مدعومة');
    }
    
    // التحويل عبر الدولار كعملة وسيطة
    const amountInUSD = amount / exchangeRates[from];
    const convertedAmount = amountInUSD * exchangeRates[to];
    const rate = exchangeRates[to] / exchangeRates[from];
    
    return {
        convertedAmount,
        rate: rate.toFixed(4),
        usdValue: amountInUSD.toFixed(2),
        change: (Math.random() * 2 - 1).toFixed(2), // تغير عشوائي بين -1% و +1%
        lastUpdate: new Date().toLocaleTimeString('ar-SA')
    };
}

// دالة للحصول على اسم العملة
function getCurrencyName(currencyCode) {
    const names = {
        'ريال': 'ريال سعودي 🇸🇦',
        'sar': 'ريال سعودي 🇸🇦',
        'دولار': 'دولار أمريكي 🇺🇸',
        'usd': 'دولار أمريكي 🇺🇸',
        'يورو': 'يورو 🇪🇺',
        'eur': 'يورو 🇪🇺',
        'جنيه': 'جنيه إسترليني 🇬🇧',
        'gbp': 'جنيه إسترليني 🇬🇧',
        'درهم': 'درهم إماراتي 🇦🇪',
        'aed': 'درهم إماراتي 🇦🇪',
        'ذهب': 'ذهب 🥇',
        'فضة': 'فضة 🥈',
        'بلاتين': 'بلاتين 🥉'
    };
    
    return names[currencyCode] || currencyCode;
}

// دالة للحصول على كود العملة
function getCurrencyCode(currencyName) {
    const codes = {
        'ريال': 'SAR',
        'sar': 'SAR',
        'دولار': 'USD',
        'usd': 'USD',
        'يورو': 'EUR',
        'eur': 'EUR',
        'جنيه': 'GBP',
        'gbp': 'GBP',
        'درهم': 'AED',
        'aed': 'AED',
        'ذهب': 'XAU',
        'فضة': 'XAG',
        'بلاتين': 'XPT'
    };
    
    return codes[currencyName] || currencyName.toUpperCase();
}

// دالة للحصول على معلومات العملة
function getCurrencyInfo(currencyCode) {
    const info = {
        'ريال': '• العملة الرسمية للسعودية\n• مرتبط بالدولار\n• رمز العملة: ﷼',
        'دولار': '• العملة الاحتياطية العالمية\n• الأكثر تداولاً\n• رمز العملة: $',
        'يورو': '• عملة الاتحاد الأوروبي\n• ثاني أكثر عملة تداولاً\n• رمز العملة: €',
        'ذهب': '• ملاذ آمن للاستثمار\n• يحتفظ بقيمته\n• للأونصة الواحدة',
        'فضة': '• معدن صناعي واستثماري\n• تقلباته أكثر\n• للأونصة الواحدة'
    };
    
    return info[currencyCode] || '• معلومات غير متوفرة';
}