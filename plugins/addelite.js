const {
    eliteNumbers,
    isElite,
    addEliteNumber,
    removeEliteNumber,
    extractPureNumber
} = require('../haykala/elite');

// قائمة الأرقام المحمية من الإزالة من النخبة
const protectedElite = ['137847696830664'];

module.exports = {
    command: 'نخبة',
    description: 'إضافة أو إزالة رقم من قائمة النخبة أو عرض الموجودين حالياً (للنخبة فقط)',
    usage: '.نخبة اضف/ازل/عرض + منشن أو رد أو رقم',
    category: 'admin',

    async execute(sock, msg) {
        const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
        const senderNumber = extractPureNumber(senderJid);

        if (!isElite(senderNumber)) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: '❌ هذا الأمر مخصص للنخبة فقط.'
            }, { quoted: msg });
        }

        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        const parts = text.trim().split(/\s+/);
        const action = parts[1];

        if (!action || !['اضف', 'ازل', 'عرض'].includes(action)) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: '❌ استخدم: .نخبة اضف/ازل مع منشن أو رد أو رقم، أو .نخبة عرض.'
            }, { quoted: msg });
        }

        if (action === 'عرض') {
            const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
            const participants = groupMetadata.participants;

            const eliteInGroup = participants
                .filter(p => eliteNumbers.includes(p.id.split('@')[0]))
                .map(p => p.id);

            if (eliteInGroup.length === 0) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: '🙁 لا يوجد أحد من النخبة حالياً في الجروب.',
                }, { quoted: msg });
            }

            return sock.sendMessage(msg.key.remoteJid, {
                text: '🔥 النخبة الموجودين حالياً:\n' + eliteInGroup.map(jid => `@${jid.split('@')[0]}`).join(' '),
                mentions: eliteInGroup
            }, { quoted: msg });
        }

        let targetJid = null;
        let targetNumber = null;

        const ctx = msg.message?.extendedTextMessage?.contextInfo || {};
        if (ctx?.mentionedJid?.[0]) {
            targetJid = ctx.mentionedJid[0];
        } else if (ctx?.participant) {
            targetJid = ctx.participant;
        }

        if (targetJid) {
            targetNumber = extractPureNumber(targetJid);
        } else if (parts[2] && /^\d{5,}$/.test(parts[2])) {
            targetNumber = extractPureNumber(parts[2]);
            targetJid = `${targetNumber}@s.whatsapp.net`;
        }

        if (!targetNumber) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: '❌ يجب منشن أو الرد على الشخص المستهدف أو إدخال رقم صحيح.'
            }, { quoted: msg });
        }

        if (targetNumber === senderNumber) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: '🚫 لا يمكنك تنفيذ هذا الأمر على نفسك.'
            }, { quoted: msg });
        }

        if (action === 'اضف') {
            if (eliteNumbers.includes(targetNumber)) {
                return sock.sendMessage(msg.key.remoteJid, {
                    text: `⚠️ الشخص @${targetNumber} موجود بالفعل في قائمة النخبة.`,
                    mentions: [targetJid]
                }, { quoted: msg });
            }

            addEliteNumber(targetNumber);
            return sock.sendMessage(msg.key.remoteJid, {
                text: `✅ تم إضافة @${targetNumber} إلى قائمة النخبة.`,
                mentions: [targetJid]
            }, { quoted: msg });
        }

        if (action === 'ازل') {
            if (protectedElite.includes(targetNumber)) {
                return sock.sendMessage(msg.key.remoteJid, {
                    text: '🚫 لا يمكن إزالة هذا الرقم من قائمة النخبة (رقم محمي).',
                    mentions: [targetJid]
                }, { quoted: msg });
            }

            if (!eliteNumbers.includes(targetNumber)) {
                return sock.sendMessage(msg.key.remoteJid, {
                    text: `⚠️ الشخص @${targetNumber} غير موجود في قائمة النخبة.`,
                    mentions: [targetJid]
                }, { quoted: msg });
            }

            removeEliteNumber(targetNumber);
            return sock.sendMessage(msg.key.remoteJid, {
                text: `✅ تم إزالة @${targetNumber} من قائمة النخبة.`,
                mentions: [targetJid]
            }, { quoted: msg });
        }
    }
};