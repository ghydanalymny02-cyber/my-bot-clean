const config = require('../config');

module.exports = {
  category: 'mouzan',
    command: 'الاعدادات',
    description: 'إعدادات البوت',
    async execute(sock, msg) {
        const reply = (text) => sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
        
        const settings = `⚙️ *إعدادات البوت*
        
🤖 اسم البوت: ${config.botName || '𝒀𝑼𝑴𝑰𝑳𝑨_𝐁𝐎𝐓'}
⚡ البادئة: .
👩‍💻 المطورة: 𝒀𝑼𝑴𝑰𝑳𝑨
📱 رقمها: 963996097873

🛠️ *الإعدادات التقنية*
📦 الإصدار: 2.5.0
💾 الذاكرة: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
⏱️ وقت التشغيل: ${Math.floor(process.uptime() / 60)} دقيقة

🌐 *حالة الاتصال*
📡 الإنترنت: متصل
✅ البوت: شغال

✨ *للحصول على المساعدة*
📝 اكتب .الاوامر`;
        
        await reply(settings);
    }
};