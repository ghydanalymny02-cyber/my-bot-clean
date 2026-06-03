// 📄 جروبي-متبند.js
const fs = require('fs');
const path = require('path');

module.exports = {
    command: ['جروبي-متبند'],
    description: 'يتحقق إذا كان الجروب متبند أم لا',
    category: 'tools',
    group: true, // يشتغل في الجروبات
    async execute(sock, msg) {
        try {
            const blockedGroupsPath = path.join(__dirname, '../data/blockedGroups.json');
            let blockedGroups = [];
            if (fs.existsSync(blockedGroupsPath)) {
                blockedGroups = JSON.parse(fs.readFileSync(blockedGroupsPath, 'utf8'));
            }

            const chatId = msg.key.remoteJid;
            if (!chatId.endsWith('@g.us')) {
                return await sock.sendMessage(chatId, { text: '❌ الأمر يعمل فقط داخل الجروبات.' });
            }

            if (blockedGroups.includes(chatId)) {
                await sock.sendMessage(chatId, {
                    text: `🚫 الجروب متبند: ${chatId}`
                });
            } else {
                await sock.sendMessage(chatId, {
                    text: `✅ الجروب شغال: ${chatId}`
                });
            }
        } catch (err) {
            console.error('❌ خطأ في جروبي-متبند:', err.message);
            if (msg.key.remoteJid) {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ حصل خطأ أثناء التحقق من حالة الجروب.' });
            }
        }
    }
};