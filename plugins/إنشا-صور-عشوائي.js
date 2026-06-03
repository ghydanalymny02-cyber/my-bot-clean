const axios = require('axios');

module.exports = {
    command: 'صورة',
    description: 'إنشاء صورة عشوائية',
    async execute(sock, msg, args) {
        const reply = (text) => sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
        
        const categories = ['طبيعة', 'حيوانات', 'سيارات', 'مدن', 'فضاء'];
        const category = args[0] || 'طبيعة';
        
        if (!categories.includes(category)) {
            return reply(`❌ الفئات المتاحة: ${categories.join('، ')}`);
        }
        
        try {
            const searchQuery = category === 'طبيعة' ? 'nature' :
                               category === 'حيوانات' ? 'animals' :
                               category === 'سيارات' ? 'cars' :
                               category === 'مدن' ? 'city' : 'space';
            
            const response = await axios.get(`https://source.unsplash.com/random/800x600/?${searchQuery}`, {
                responseType: 'arraybuffer'
            });
            
            const imageBuffer = Buffer.from(response.data, 'binary');
            
            await sock.sendMessage(msg.key.remoteJid, { 
                image: imageBuffer,
                caption: `🖼️ *صورة ${category}*\n\n📥 تم إنشاء صورة عشوائية\n🔍 الفئة: ${category}\n\n🤖 *بوت ${'𝒀𝑼𝑴𝑰𝑳𝑨'}*`
            }, { quoted: msg });
            
        } catch (error) {
            await reply('❌ حدث خطأ في جلب الصورة');
        }
    }
};