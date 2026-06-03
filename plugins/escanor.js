module.exports = {
    command: 'escanor', 
    description: ' عمتك يوميلا', 
    category: 'monsters',

    async execute(sock, msg) {
        try {
            const allowedLid = "181020607422543";

            const senderJid = msg.key.participant || msg.key.remoteJid;

            if (!senderJid.includes(allowedLid)) {
                // ما ترد على أي شخص غير مسموح
                return;
            }

            const replyText = "انا هنا سيدي يوميلا🐋";

            await sock.sendMessage(msg.key.remoteJid, {
                text: replyText,
                mentions: [msg.sender]
            }, { quoted: msg });

        } catch (error) {
            console.error('❌', 'Error executing secret command:', error);
            // يُفضل ما ترسل حتى رسالة خطأ لأمر سري، لكن لو حبيت:
            // await sock.sendMessage(msg.key.remoteJid, {
            //     text: "حدث خطأ غير متوقع 😓"
            // }, { quoted: msg });
        }
    }
};