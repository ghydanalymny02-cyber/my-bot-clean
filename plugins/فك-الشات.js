// 📄 فك-الشات.js
const fs = require('fs');
const path = require('path');

const blockedGroupsFile = path.join(__dirname, '..', 'data', 'blockedGroups.json');

// تأكد من وجود ملف الجروبات الممنوعة
if (!fs.existsSync(blockedGroupsFile)) {
    fs.writeFileSync(blockedGroupsFile, JSON.stringify([]));
}

function loadBlockedGroups() {
    try {
        return JSON.parse(fs.readFileSync(blockedGroupsFile, 'utf8'));
    } catch (err) {
        console.error('❌ خطأ في قراءة blockedGroups.json:', err.message);
        return [];
    }
}

function saveBlockedGroups(list) {
    try {
        fs.writeFileSync(blockedGroupsFile, JSON.stringify(list, null, 2));
    } catch (err) {
        console.error('❌ خطأ في حفظ blockedGroups.json:', err.message);
    }
}

module.exports = {
    command: 'فك-الشات',
    description: '✅ يرفع البوت من التوقف في جروب معين',
    usage: '.فك-الشات <الجروب الحالي>',
    category: 'DEVELOPER',
    group: true, // يشتغل فقط في الجروبات

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text: '❌ هذا الأمر يعمل فقط داخل الجروبات.'
            }, { quoted: msg });
        }

        let blockedGroups = loadBlockedGroups();

        if (!blockedGroups.includes(chatId)) {
            return sock.sendMessage(chatId, {
                text: `⚠️ الجروب مش متبند أصلاً: ${chatId}`
            }, { quoted: msg });
        }

        // إزالة الجروب من القائمة
        blockedGroups = blockedGroups.filter(id => id !== chatId);
        saveBlockedGroups(blockedGroups);

        await sock.sendMessage(chatId, {
            text: `✅ تم فك البان عن البوت في هذا الجروب: ${chatId}\n\n⚡ ملاحظة: الأمر .جروبي-متبند يظل يعمل مع أي عضو.`
        }, { quoted: msg });
    }
};