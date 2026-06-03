module.exports = {
    command: 'مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹',
    description: 'نداء مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹',
    usage: '.test',
    category: 'tools',    
    
    async execute(sock, msg) {
        try {
            const decoratedText = `> مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑰𝑺 𝑯𝑬𝑹𝑬 𝑾𝑯𝑨𝑻 𝑫𝑶 𝒀𝑶𝑼 𝑾𝑨𝑵𝑻?`;
            await sock.sendMessage(msg.key.remoteJid, {
                text: decoratedText,
                mentions: [msg.sender]
            }, { quoted: msg });
        } catch (error) {
            console.error('❌', 'Error executing test:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: responses.error.general(error.message || error.toString())
            }, { quoted: msg });
        }
    }
};