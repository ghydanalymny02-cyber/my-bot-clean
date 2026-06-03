const activeSpams = global.activeSpams || new Map();
global.activeSpams = activeSpams;

module.exports = {
  category: 'tools',
    command: "منشنات",
    description: "سبام منشن لشخص معمول له @ بسرعة عالية",
    
    execute: async (sock, m) => {
        try {
            const from = m.key.remoteJid;

            // نجيب المنشن الحقيقي من الرسالة
            const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

            if (!mentionedJid) {
                await sock.sendMessage(from, { text: "❌ لازم تعمل منشن للشخص (@)" });
                return;
            }

            // لو فيه سبام شغال نوقفه الأول
            if (activeSpams.has(from)) {
                clearInterval(activeSpams.get(from));
                activeSpams.delete(from);
            }

            // نبدأ السبام (كل 0.5 ثانية)
            let intervalTime = 500;
            let spammer = setInterval(async () => {
                try {
                    await sock.sendMessage(from, { 
                        text: `👀 @${mentionedJid.split('@')[0]}`, 
                        mentions: [mentionedJid]
                    });
                } catch (err) {
                    console.error("❌ مشكلة في السبام، هنرجع للـ 1 ثانية:", err);
                    clearInterval(spammer);
                    // fallback: 1 ثانية
                    spammer = setInterval(async () => {
                        await sock.sendMessage(from, { 
                            text: `👀 @${mentionedJid.split('@')[0]}`, 
                            mentions: [mentionedJid]
                        });
                    }, 1000);
                    activeSpams.set(from, spammer);
                }
            }, intervalTime);

            activeSpams.set(from, spammer);

            await sock.sendMessage(from, { 
                text: `🚀 بدأنا منشنات سريع لـ @${mentionedJid.split('@')[0]} (كل ${intervalTime/1000} ثانية)`, 
                mentions: [mentionedJid] 
            }, { quoted: m });

        } catch (err) {
            console.error("❌ خطأ في منشنات.js:", err);
        }
    }
};