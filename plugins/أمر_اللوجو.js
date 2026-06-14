// 📁 ملف: أمر_اللوجو.js
// 🎨 أمر إنشاء لوجو نصي
// 👑 بواسطة: يوميلا

module.exports = {
    command: ['لوجو', 'شعار', 'تصميم'],
    description: '🎨 إنشاء لوجو نصي مخصص',
    category: 'صور',
    emoji: '🎨',
    
    async execute(sock, msg) {
        const args = msg.body.split(' ');
        const text = args.slice(1).join(' ') || 'يوميلا';
        
        if (text.length > 20) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ *النص طويل جداً:*\n\n📝 الحد الأقصى 20 حرف\n🔍 حاول تقصير النص` 
            }, { quoted: msg });
            return;
        }
        
        try {
            // قائمة أنماط اللوجوهات
            const logoStyles = [
                {
                    name: 'كلاسيكي',
                    url: `https://dummyimage.com/300x100/000/fff&text=${encodeURIComponent(text)}`,
                    style: 'أبيض على أسود'
                },
                {
                    name: 'أزرق',
                    url: `https://dummyimage.com/300x100/007bff/fff&text=${encodeURIComponent(text)}`,
                    style: 'أبيض على أزرق'
                },
                {
                    name: 'ذهبي',
                    url: `https://dummyimage.com/300x100/ffd700/000&text=${encodeURIComponent(text)}`,
                    style: 'أسود على ذهبي'
                },
                {
                    name: 'وردي',
                    url: `https://dummyimage.com/300x100/ff69b4/fff&text=${encodeURIComponent(text)}`,
                    style: 'أبيض على وردي'
                },
                {
                    name: 'أخضر',
                    url: `https://dummyimage.com/300x100/28a745/fff&text=${encodeURIComponent(text)}`,
                    style: 'أبيض على أخضر'
                }
            ];
            
            const selectedStyle = logoStyles[Math.floor(Math.random() * logoStyles.length)];
            
            await sock.sendMessage(msg.key.remoteJid, { 
                image: { url: selectedStyle.url },
                caption: `
🎨 *لوجو مخصص لك!*
══════════════════════════

📝 *النص:* ${text}
🎭 *النمط:* ${selectedStyle.name}
🎨 *التصميم:* ${selectedStyle.style}
📏 *الأبعاد:* 300×100 بكسل

✨ *مميزات التصميم:*
• أنيق واحترافي
• جاهز للاستخدام
• دقة عالية
• تحميل سريع

💡 *نصائح:*
• استخدمه كصورة بروفايل
• أضفه لمشاريعك
• شاركه مع أصدقائك

👑 *مصمم لك بواسطة:* يوميلا
                `.trim()
            }, { quoted: msg });
            
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ *خطأ في التصميم:*\n\n🔍 تأكد من اتصال الإنترنت\n💡 جرب نصاً أقصر` 
            }, { quoted: msg });
        }
    }
};