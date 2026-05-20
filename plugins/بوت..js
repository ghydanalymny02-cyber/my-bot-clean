// ⚡ BOT INFO | مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 BOT ⚡
const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'بوتيي',
    description: 'عرض معلومات البوت بشكل فخم',
    usage: '.بوتي',
    category: 'tools',

    async execute(sock, msg) {
        try {
            // حساب عدد الأوامر من مجلد commands
            const commandsDir = path.join(__dirname); // لو كل الأوامر في نفس المجلد
            const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
            const commandsCount = commandFiles.length;

            // نص المعلومات الفخم
            const botInfo = `
╭──〔 ⚙️ 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 〕──╮
┃  الاسم      : 🛡 *〘•❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹  •〙👑『𝑩𝑶𝑻』↘
┃ 📦 الأوامر   : *${commandsCount}*
┃ 🛠️ الإصدار   : *6.0*
┃ 👑 المطور    : *〘•مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹•〙*
┃ ⏱️ التشغيل   : *٢٤‏/٨‏/٢٠٢٥*
┃ 🧠 اللغة     : *Node.js (Baileys)*
┃ ⚡ الحالة    : *Online ✅*
┃ 🌍 القوة     : *Unlimited 🔥*
┃ 🐲 اللقب     :👑 *〘•مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹•〙*👑
╯━━━━━━━━━━━━━━╰

⚡ *〘•مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 •〙👑『𝑩🌒𝑻』*⚡ is always watching... 💀✨
`;

            // إرسال الرسالة
            await sock.sendMessage(msg.key.remoteJid, {
                text: botInfo
            }, { quoted: msg });

            // تفاعل تلقائي
            await sock.sendMessage(msg.key.remoteJid, {
                react: {
                    text: '⚙️',
                    key: msg.key
                }
            });

        } catch (error) {
            console.error('❌ Error showing bot info:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Error:\n${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};