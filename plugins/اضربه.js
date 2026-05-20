module.exports = {
    command: 'اضربه',
    async execute(sock, m) {
        const chatId = m.key.remoteJid;

        await sock.sendMessage(chatId, { text: `*انا شايف انه لازم يتضرب فعلا هروح اضربه* 🥊
❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂` });
    }
};