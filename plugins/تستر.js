module.exports = {
    command: 'سرعة',
    description: 'اختبار البوت وعرض سرعته ⏱️',
    usage: '.مـــجـــهـــول ',
    category: 'tools',

    async execute(sock, msg) {
        try {
            // تحديد JID مع fallback
            const jid = msg?.key?.remoteJid || msg?.from;
            if (!jid) return console.warn('❌ لا يوجد remoteJid للإرسال');

            // قياس سرعة البوت
            const start = Date.now();
            try { await sock.sendPresenceUpdate('composing', jid); } catch {}
            const ping = Date.now() - start;

            // نص الرسالة المزخرف
            const decoratedText = `🌋 *مـــجـــهـــول⊰𝑩𝑶𝑻* ❄
✅ جاهز للاستخدام
⚡ سرعة الاستجابة: ${ping}ms`;

            // إرسال الرسالة بدون externalAdReply لتجنب undefined
            await sock.sendMessage(jid, {
                text: decoratedText,
                mentions: msg?.sender ? [msg.sender] : [],
            }, { quoted: msg });

        } catch (error) {
            console.error('❌ Error executing غووجو command:', error);

            await sock.sendMessage(msg?.key?.remoteJid || msg?.from || '', {
                text: `⚠️ حدث خطأ أثناء تنفيذ الأمر.\n\n📄 التفاصيل: ${error?.message || error?.toString() || 'Unknown error'}`,
            }, { quoted: msg });
        }
    }
};