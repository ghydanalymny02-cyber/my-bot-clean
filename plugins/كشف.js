const fs = require('fs');
const path = require('path');

const { getProfilePictureUrl } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'كشف',
    execute: async (sock, msg) => {
        if (!msg.isGroup) return msg.reply("❌ هذا الأمر فقط للمجموعات.");

        const group = await sock.groupMetadata(msg.chat);
        const members = group.participants;

        let suspicious = [];

        for (const member of members) {
            const id = member.id;
            const num = id.split('@')[0];

            if (id.includes(':') || id.includes('.bot')) {
                suspicious.push(`${num} — مشتبه أنه بوت 🤖`);
                continue;
            }

            if (!num.startsWith('20') && !num.startsWith('011') && !num.startsWith('010') && !num.startsWith('012') && !num.startsWith('015')) {
                suspicious.push(`${num} — رقم أجنبي 🌍`);
                continue;
            }

            try {
                await sock.profilePictureUrl(id, 'image');
            } catch {
                suspicious.push(`${num} — بدون صورة شخصية 🚫`);
            }
        }

        if (suspicious.length === 0) {
            return msg.reply("✅ لا يوجد أعضاء مشبوهين في هذه المجموعة.");
        }

        const message = `📍 كشف أعضاء المجموعة:\n\n` +
                        suspicious.map((s, i) => `${i + 1}. ${s}`).join("\n") +
                        `\n\n⚠️ راقب الأرقام الغريبة بدقة.`;

        msg.reply(message);
    }
};
