module.exports = {
    command: ['pair', 'اقتران'], // تأكد أن المصفوفة هي الطريقة المعتمدة في بوتك
    category: 'tools',
    description: 'الحصول على كود الربط',
    
    // تأكد أن أسماء المتغيرات هي نفسها التي يرسلها الـ handler الخاص بك
    async execute(sock, msg, args) {
        try {
            if (!args[0]) {
                return await sock.sendMessage(msg.key.remoteJid, { text: 'يجب كتابة الرقم، مثال: .pair 967xxxxxxxxx' }, { quoted: msg });
            }
            
            const phoneNumber = args[0].replace(/[^0-9]/g, '');
            await sock.sendMessage(msg.key.remoteJid, { text: 'جاري جلب كود الربط، يرجى الانتظار...' }, { quoted: msg });
            
            // تأكد من أن الدالة هي requestPairingCode
            const code = await sock.requestPairingCode(phoneNumber);
            
            await sock.sendMessage(msg.key.remoteJid, { text: `✅ كود الربط الخاص بك هو: *${code}*` }, { quoted: msg });
            
        } catch (error) {
            console.error(error);
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ حدث خطأ أثناء جلب الكود: ' + error.message }, { quoted: msg });
        }
    }
};

