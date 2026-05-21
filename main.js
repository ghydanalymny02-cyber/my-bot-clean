const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');

async function startBot() {
    console.log("--- البوت بدأ العمل ---");
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: ['Ubuntu', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    // سأجبر البوت على طلب الكود فوراً وبوضوح
    console.log("--- جاري طلب كود الاقتران ---");
    try {
        const code = await sock.requestPairingCode("967700821174");
        console.log("========================================");
        console.log("كود الاقتران الخاص بك هو: " + code);
        console.log("========================================");
    } catch (e) {
        console.log("خطأ في طلب الكود: " + e);
    }
}

startBot();
