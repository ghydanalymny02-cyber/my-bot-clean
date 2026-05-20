
module.exports = {
    command: 'كرولو',
    description: 'اختبار البوت',
    usage: '.كرولو',
    category: 'tools',    
    
    async execute(sock, msg) {
        try {
            const decoratedText = `𝗖𝗛𝗥𝗢𝗟𝗟𝗢 𝗔𝗧 𝗬𝗢𝗨𝗥 𝗦𝗘𝗥𝗩𝗜𝗖𝗘 𝗬𝗢𝗨𝗥 𝗢𝗥𝗗𝗘𝗥𝗦`;
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