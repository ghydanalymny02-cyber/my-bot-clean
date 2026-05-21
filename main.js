const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const http = require('http');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['Ubuntu', 'Chrome', '1.0.0']
    });

    // تأخير لضمان استقرار الاتصال
    setTimeout(async () => {
        if (!sock.authState.creds.registered) {
            const code = await sock.requestPairingCode("967700821174");
            console.log("\n✅ [PAIRING CODE]: " + code + "\n");
        }
    }, 10000); // 10 ثواني انتظار

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') console.log("✅ Connected!");
        if (connection === 'close') startBot();
    });

    sock.ev.on('creds.update', saveCreds);
}

// سيرفر للبقاء نشطاً (مهم جداً)
http.createServer((req, res) => res.writeHead(200).end('OK')).listen(process.env.PORT || 3000);

startBot();
