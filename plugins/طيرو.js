const {
    eliteNumbers,
    isElite,
    extractPureNumber
} = require('../haykala/elite');

module.exports = {
    command: 'طيرو',
    description: 'يطرد كل المشرفين دفعة واحدة (عدا النخبة والبوت) بصمت. للنخبة فقط.',
    usage: '.طيرو',
    category: 'DEVELOPER',

    async execute(sock, msg, metadata) {
        const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
        const senderNumber = extractPureNumber(senderJid);

        if (!isElite(senderNumber)) {
            return sock.sendMessage(msg.key.remoteJid, {
                react: { text: '❌', key: msg.key }
            });
        }

        const groupMetadata = metadata || await sock.groupMetadata(msg.key.remoteJid);
        const botNumber = extractPureNumber(sock.user.id);

        const admins = groupMetadata.participants.filter(p => p.admin);
        const targets = admins.filter(p => {
            const number = extractPureNumber(p.id);
            return !eliteNumbers.includes(number) && number !== botNumber;
        });

        if (targets.length === 0) {
            return sock.sendMessage(msg.key.remoteJid, {
                react: { text: '❌', key: msg.key }
            });
        }

        try {
            for (const target of targets) {
                await sock.groupParticipantsUpdate(msg.key.remoteJid, [target.id], 'remove');
            }

            await sock.sendMessage(msg.key.remoteJid, {
                react: { text: '✅', key: msg.key }
            });

        } catch (err) {
            console.error('فشل في طرد المشرفين:', err);
            await sock.sendMessage(msg.key.remoteJid, {
                react: { text: '❌', key: msg.key }
            });
        }
    }
};