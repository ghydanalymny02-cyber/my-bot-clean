const fs = require('fs');
const path = require('path');

const zawajFile = path.join(process.cwd(), 'zawaj.json');

function loadZawaj() {
    if (!fs.existsSync(zawajFile)) fs.writeFileSync(zawajFile, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(zawajFile));
}

module.exports = {
    command: 'عرض',
    description: 'عرض قائمة المتزوجين في المجموعة',
    category: 'fun',

    async execute(sock, msg) {
        const groupJid = msg.key.remoteJid;
        let zawajData = loadZawaj();

        if (zawajData.length === 0) {
            return sock.sendMessage(groupJid, { text: "❗ ما في أي زيجات مسجلة لحد الآن." }, { quoted: msg });
        }

        let list = zawajData.map((z, i) =>
            `💍 زواج رقم ${i + 1}:\n👑 العريس: @${z.groom.split('@')[0]}\n👰 العروسة: @${z.bride.split('@')[0]}\n📜 المأذون: @${z.maazoun.split('@')[0]}`
        ).join("\n\n");

        await sock.sendMessage(groupJid, {
            text: list,
            mentions: zawajData.flatMap(z => [z.groom, z.bride, z.maazoun])
        }, { quoted: msg });
    }
};