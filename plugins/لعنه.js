const fs = require('fs');
const path = require('path');
const protectedPath = path.join(__dirname, '..', 'data', 'protectedGroups.json');

let protectedGroups = [];
if (fs.existsSync(protectedPath)) {
    protectedGroups = JSON.parse(fs.readFileSync(protectedPath, 'utf8'));
}

let activeCurses = {};

module.exports = {
    name: 'لعنه',
    execute: async (sock, msg) => {
        if (!msg.isGroup) return msg.reply("❌ هذا الأمر فقط للمجموعات.");

        if (protectedGroups.includes(msg.chat)) {
            return msg.reply("🚫 هذه المجموعة محمية من الزرف.\nانسحب بهدوء.");
        }

        const metadata = await sock.groupMetadata(msg.chat);
        const botNumber = (await sock.state.legacy.user.id.split(':')[0]) + '@s.whatsapp.net';

        let members = metadata.participants
            .filter(p => p.id !== botNumber)
            .map(p => p.id);

        if (members.length === 0) return msg.reply("❌ مفيش حد أقدر ألعنه 😈");

        msg.reply(`👹 تم إطلاق لعنة الطرش...\nهبدأ أطرد كل 10 ثواني.`);

        activeCurses[msg.chat] = setInterval(async () => {
            const updatedMeta = await sock.groupMetadata(msg.chat);
            let newMembers = updatedMeta.participants
                .filter(p => p.id !== botNumber)
                .map(p => p.id);

            if (newMembers.length === 0) {
                clearInterval(activeCurses[msg.chat]);
                delete activeCurses[msg.chat];
                return msg.reply("✅ انتهت اللعنة. كلهم طاروا.");
            }

            const random = newMembers[Math.floor(Math.random() * newMembers.length)];
            await sock.groupParticipantsUpdate(msg.chat, [random], "remove");
            await msg.reply(`تم طرد ${random.split('@')[0]} 😈`);

        }, 10000);
    }
};
