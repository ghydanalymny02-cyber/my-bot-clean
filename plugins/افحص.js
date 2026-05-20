const { jidDecode } = require('@whiskeysockets/baileys');

module.exports = {
    command: 'افحص',
    category: 'tools',
    description: 'عرض حالة البوت وسرعة استجابته ⏱️',

    async execute(sock, msg) {
        try {
            const chatId = msg.key.remoteJid;

            const start = Date.now();
            const uptimeSeconds = process.uptime();
            const uptimeFormatted = new Date(uptimeSeconds * 1000).toISOString().substr(11, 8);
            const end = Date.now();
            const ping = end - start;

            const statusMessage = `
🟢 *حالة البوت | 𝐁𝐨𝐭 𝐒𝐭𝐚𝐭𝐮𝐬*

⌛️ *المدة التي شُغِل فيها البوت:* 
   \`\`\`${uptimeFormatted}\`\`\`

🔰 *سرعة الاستجابة (البينغ):* 
   \`${ping} ms\`

🫦 *شكرًا لاستخدامك بوت غوجو!*
♜𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂`.trim();

            await sock.sendMessage(chatId, { text: statusMessage }, { quoted: msg });

        } catch (error) {
            console.error('❌ خطأ في كود حالة البوت:', error);
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ حدث خطأ أثناء جلب حالة البوت، حاول لاحقًا.' }, { quoted: msg });
        }
    }
};