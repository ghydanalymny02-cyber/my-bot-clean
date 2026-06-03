const fs = require('fs');
const path = require('path');

const zawajFile = path.join(process.cwd(), 'zawaj.json');

function loadZawaj() {
    if (!fs.existsSync(zawajFile)) fs.writeFileSync(zawajFile, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(zawajFile));
}

function saveZawaj(data) {
    fs.writeFileSync(zawajFile, JSON.stringify(data, null, 2));
}

module.exports = {
    command: 'زوجه',
    description: 'تزويج شخص محدد بعروس عشوائية ومأذون عشوائي',
    category: 'fun',

    async execute(sock, msg) {
        const groupJid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.participant || msg.key.remoteJid;

        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentions.length === 0) {
            return sock.sendMessage(groupJid, { text: "❗ لازم تمنشن شخص عشان أزوجه." }, { quoted: msg });
        }

        const groom = mentions[0];

        const metadata = await sock.groupMetadata(groupJid);
        const participants = metadata.participants.map(p => p.id);

        let bride = participants.filter(p => p !== groom)[Math.floor(Math.random() * (participants.length - 1))];
        let others = participants.filter(p => p !== groom && p !== bride);
        let maazoun = others[Math.floor(Math.random() * others.length)];

        let zawajData = loadZawaj();
        zawajData.push({
            groom: groom,
            bride: bride,
            maazoun: maazoun
        });
        saveZawaj(zawajData);

        await sock.sendMessage(groupJid, {
            text: `💍 تم الزواج!\n\n👑 العريس: @${groom.split('@')[0]}\n👰 العروسة: @${bride.split('@')[0]}\n📜 المأذون: @${maazoun.split('@')[0]}`,
            mentions: [groom, bride, maazoun]
        }, { quoted: msg });
    }
};