const { isElite, extractPureNumber } = require('../haykala/elite');
const fs = require('fs');
const { join } = require('path');

const ZARF_PATH = join(process.cwd(), 'zarf.json');

// دالة مساعدة لقراءة البيانات
function loadZarf() {
    if (!fs.existsSync(ZARF_PATH)) return { messages: { mention: 'مرحباً بالجميع!' } };
    try {
        return JSON.parse(fs.readFileSync(ZARF_PATH, 'utf8'));
    } catch (e) {
        return { messages: { mention: 'مرحباً بالجميع!' } };
    }
}

module.exports = {
    command: ['منشن', 'تعديل'],
    description: 'إدارة رسائل المنشن الجماعي',
    category: 'tools',

    async execute(sock, msg, args = []) {
        try {
            const groupJid = msg.key.remoteJid;
            const senderJid = msg.key.participant || msg.key.remoteJid;
            const senderNumber = extractPureNumber(senderJid);
            const command = msg.command?.toLowerCase(); // التأكد من اسم الأمر

            if (!groupJid.endsWith('@g.us')) return sock.sendMessage(groupJid, { text: '❌ هذا الأمر للقروبات فقط.' }, { quoted: msg });
            if (!isElite(senderNumber)) return sock.sendMessage(groupJid, { text: '🚫 مخصص للنخبة فقط.' }, { quoted: msg });

            // 1. أمر التعديل: .تعديل منشن [النص]
            if (command === 'تعديل' && args[0] === 'منشن') {
                const newText = args.slice(1).join(' ');
                if (!newText) return sock.sendMessage(groupJid, { text: '⚠️ اكتب النص الذي تريد حفظه للمنشن.' }, { quoted: msg });

                let data = loadZarf();
                data.messages.mention = newText;
                fs.writeFileSync(ZARF_PATH, JSON.stringify(data, null, 2));
                return sock.sendMessage(groupJid, { text: '✅ تم حفظ نص المنشن الجديد بنجاح.' }, { quoted: msg });
            }

            // 2. أمر المنشن: .منشن
            const data = loadZarf();
            const mentionText = data.messages.mention;
            const metadata = await sock.groupMetadata(groupJid);
            const mentions = metadata.participants.map(p => p.id);

            return sock.sendMessage(groupJid, {
                text: mentionText,
                mentions: mentions
            }, { quoted: msg });

        } catch (err) {
            console.error(err);
            sock.sendMessage(msg.key.remoteJid, { text: `❌ خطأ: ${err.message}` }, { quoted: msg });
        }
    }
};
