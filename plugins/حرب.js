const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'بوتي',
    description: 'اختبار البوت',
    usage: '.بوتي',
    category: 'tools',

    async execute(sock, msg) {
        try {
            const decoratedText = `
╭─❖ 『 👑 𝒀𝑼𝑴𝑰𝑳𝑨 』 ❖─╮
│
> │  𝒀𝑼𝑴𝑰𝑳𝑨 𝑺𝑬𝑹𝑽𝑬𝑹 𝑼𝑵𝑪𝑳𝑬
│
╰────────────╯`;

            const imagePath = path.join(__dirname, '../resources/escanor5.jpg');
            const hasImage = fs.existsSync(imagePath);
            const imageBuffer = hasImage ? fs.readFileSync(imagePath) : null;

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: decoratedText,
                    contextInfo: {
                        externalAdReply: {
                            title: "👑 𝒀𝑼𝑴𝑰𝑳𝑨 ❄ ",
                            body: "𝑺𝑬𝑹𝑽𝑬𝑹 𝑼𝑵𝑪𝑳𝑬 is always watching...",
                            thumbnail: imageBuffer,
                            mediaType: 1,
                            sourceUrl: "nn",
                            renderLargerThumbnail: false,
                            showAdAttribution: true
                        }
                    },
                    mentions: [msg.sender]
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('❌ خطأ في تنفيذ حرب:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حدث خطأ: ${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};