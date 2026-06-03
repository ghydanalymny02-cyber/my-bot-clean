module.exports = {
    command: 'فريقي',
    description: 'تعريف عن فريق 𝕖𝕤𝕔𝕒𝕟𝕠𝕣 Team بأسلوب مزخرف دون صور',
    usage: '.هدفنا',
    category: 'هدفنا',

    async execute(sock, msg) {
        try {
            // تأكد من أن بيانات الرسالة موجودة
            const jid = msg.key?.remoteJid;
            if (!jid) throw new Error('لم يتم العثور على معرف الدردشة (JID).');

            const sender = msg.sender || msg.key.participant || jid;
            const senderName = msg.pushName || 'صديقي';

            const messageText = `
            
*╭─🇸🇾『 𝒀𝑼𝑴𝑰𝑳𝑨 』🇵🇸─╮*

*فريق ${senderName} لـ تطوير البوتات 💻*

*🎯 هدفنا:*
- دعم المجتمع العربي بالتقنية والبرمجة.
- بناء بوتات احترافية بلمسة ذوق وفن.
- نشر أدوات مفتوحة المصدر ومساعدة الجميع.

*👑 أبرز الأعضاء:*
① ❄️ 𝒀𝑼𝑴𝑰𝑳𝑨
② 🩸 𝑲𝑨𝑵𝑬𝑲𝒊 
③ 🦅 𝑴𝑰𝑲𝑬𝒀
④ 🪶 𝑺𝑯𝑨𝑫𝑶𝑾
⑤ 🌋 𝑬𝑺𝑪𝑨𝑵𝑶𝑹
*📎 روابط مهمة:*
جروب الدعم: https://chat.whatsapp.com/KUuaMiUI9BX2kdh0gcFsHV?mode=wwt
البوت الرسمي: wa.me/963996097873

*📜 استخدم الأمر ( .اوامر ) لتصفح ميزات  📜*

*╯──────────────╰*


`.trim();

            await sock.sendMessage(
                jid,
                {
                    text: messageText,
                    mentions: [sender]
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('❌ خطأ في أمر هدفنا:', error);
            await sock.sendMessage(
                msg.key?.remoteJid || msg.from || '',
                { text: '❌ حدث خطأ أثناء تنفيذ أمر تعريف فريق GOJO.' },
                { quoted: msg }
            );
        }
    }
};