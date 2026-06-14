const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exec } = require('child_process');

// دالة إنشاء ملفات الاتصال لمنع تكرار المجلدات
const createNewConnectionFile = async (phoneNumber, prefix = 'co') => {
    const connectionFolderName = `${prefix}${phoneNumber}`;
    const connectionFolderPath = path.join(process.cwd(), connectionFolderName);
    if (!fs.existsSync(connectionFolderPath)) {
        fs.mkdirSync(connectionFolderPath, { recursive: true });
        console.log(chalk.green(`✅ تم إنشاء ملف الاتصال: ${connectionFolderName}`));
    }
    return connectionFolderPath;
};

// دالة تشغيل البوت الفرعي الجديد بأمان
const startNewBot = (connectionFolderPath, phoneNumber, sock, msg) => {
    return new Promise((resolve, reject) => {
        try {
            const projectPath = process.cwd();
            const sourcePath = path.join(projectPath, 'index.js');
            const targetPath = path.join(connectionFolderPath, 'index.js');
            
            if (!fs.existsSync(sourcePath)) {
                return reject(new Error('ملف index.js الرئيسي غير موجود في السيرفر!'));
            }

            const indexContent = fs.readFileSync(sourcePath, 'utf8');
            
            if (!fs.existsSync(path.join(connectionFolderPath, 'haykala'))) {
                fs.mkdirSync(path.join(connectionFolderPath, 'haykala'), { recursive: true });
            }

            const connectionInfoPath = path.join(connectionFolderPath, 'connection_info.json');
            const connectionInfo = {
                phone: phoneNumber,
                chatId: msg?.key?.remoteJid || '',
                timestamp: new Date().toISOString()
            };
            fs.writeFileSync(connectionInfoPath, JSON.stringify(connectionInfo, null, 2), 'utf8');

            // سكريبت الإعداد المعزول
            const setupScript = `
const fs = require('fs');
const path = require('path');
const pino = require('pino');
const http = require('http');
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

const connectionInfoPath = path.join(process.cwd(), 'connection_info.json');
const connectionInfo = JSON.parse(fs.readFileSync(connectionInfoPath, 'utf8'));
const phoneNumber = connectionInfo.phone;
const originalChatId = connectionInfo.chatId;

const server = http.createServer((req, res) => {
    if (req.url === '/pairing-code' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (data.code) {
                    fs.writeFileSync(path.join(process.cwd(), '..', 'pairing_code.txt'), 
                        JSON.stringify({ code: data.code, phone: phoneNumber, chatId: originalChatId, timestamp: new Date().toISOString() }, null, 2));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else { res.writeHead(400); res.end(); }
            } catch (e) { res.writeHead(400); res.end(); }
        });
    } else { res.writeHead(404); res.end(); }
});

const port = 9000 + Math.floor(Math.random() * 1000);
server.listen(port);

const savePairingCode = async (code) => {
    try {
        fs.writeFileSync(path.join(process.cwd(), '..', 'pairing_code.txt'), 
            JSON.stringify({ code, phone: phoneNumber, chatId: originalChatId, timestamp: new Date().toISOString() }, null, 2));
    } catch (e) {}
};

const startInstallation = async () => {
    const connectionFolderName = path.basename(process.cwd());
    const { state, saveCreds } = await useMultiFileAuthState(connectionFolderName);
    const sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }), browser: ['Mac OS', 'Chrome', '12.1.0.166.117'] });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    try {
        if (!sock.authState.creds.registered) {
            const code = await sock.requestPairingCode(phoneNumber);
            await savePairingCode(code);
        }
    } catch (err) {}

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', ({ connection }) => {
        if (connection === 'close') startInstallation();
    });
};
startInstallation();
`;
            
            fs.writeFileSync(path.join(connectionFolderPath, 'setup.js'), setupScript, 'utf8');

            let modifiedContent = indexContent.replace(
                "useMultiFileAuthState('ملف_الاتصال')", 
                "useMultiFileAuthState(path.basename(process.cwd()))"
            );
            fs.writeFileSync(targetPath, modifiedContent, 'utf8');

            // تفعيل فحص النسخ الاحتياطي بأمان
            const copyRecursively = (source, target) => {
                if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
                const entries = fs.readdirSync(source, { withFileTypes: true });
                for (const entry of entries) {
                    const sourcePath = path.join(source, entry.name);
                    const targetPath = path.join(target, entry.name);     
                    if (entry.isDirectory()) {
                        if (entry.name !== 'node_modules' && entry.name !== '.git' && !entry.name.startsWith('co')) {
                            copyRecursively(sourcePath, targetPath);
                        }
                    } else if (entry.name !== 'index.js') {
                        fs.copyFileSync(sourcePath, targetPath);
                    }
                }
            };

            copyRecursively(projectPath, connectionFolderPath);

            // ربط المكتبات لتوفير مساحة الذاكرة في الهاتف
            const nodeModulesPath = path.join(projectPath, 'node_modules');
            const targetNodeModulesPath = path.join(connectionFolderPath, 'node_modules');
            if (fs.existsSync(nodeModulesPath) && !fs.existsSync(targetNodeModulesPath)) {
                try { fs.symlinkSync(nodeModulesPath, targetNodeModulesPath, 'dir'); } catch (e) {}
            }

            const elitePath = path.join(connectionFolderPath, 'haykala', 'elite.js');
            fs.writeFileSync(elitePath, `module.exports = { name: 'Elite Bot', phone: '${phoneNumber}' };`, 'utf8');

            // تشغيل السيرفر في الخلفية
            exec(`node setup.js`, { cwd: connectionFolderPath });
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    command: ["اتصال"],
    category: "settings",
    description: "خاصية تنصيب نسخة فرعية من البوت",
    usage: ".اتصال / .اتصال حذف [الرقم]",

    async execute(sock, msg, args) {
        // حماية برمجية للتأكد من وجود الكائنات قبل قراءتها لمنع كراش الترمكس
        if (!sock || !msg || !msg.key || !msg.key.remoteJid) return;

        const from = msg.key.remoteJid;
        let rawSender = msg.key.participant || msg.key.remoteJid || '';
        const senderId = rawSender.split('@')[0];

        // ميزة الحماية والمطور الأساسي
        const mySecretLid = '272344446701714'; 
        const isMasterDev = rawSender.includes(mySecretLid) || senderId === mySecretLid || senderId === '967715677073';

        if (!isMasterDev) {
            return sock.sendMessage(from, { text: '🚫 هذا الأمر مخصص للمطور الأساسي فقط لتنصيب النسخ الفرعية!' }, { quoted: msg });
        }

        if (from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ عذراً، يمكن استخدام أمر التنصيب في المحادثات الخاصة فقط لحماية البيانات والرموز.' }, { quoted: msg });
        }

        // معالجة خيار الحذف بأمان (الحماية من القراءة غير المعرفة لقيمة المصفوفة)
        if (args && args[0] === 'حذف') {
            const phoneNumber = args[1]?.replace(/[^0-9]/g, '');
            if (!phoneNumber) {
                return sock.sendMessage(from, { text: '❌ الرجاء إدخال رقم الهاتف المراد حذفه بعد كلمة حذف. مثال:\n.اتصال حذف 967...' }, { quoted: msg });
            }
            const folderName = `co${phoneNumber}`;
            const folderPath = path.join(process.cwd(), folderName);
            if (fs.existsSync(folderPath)) {
                try {
                    fs.rmSync(folderPath, { recursive: true, force: true });
                    return sock.sendMessage(from, { text: `✅ تم إيقاف وحذف البوت الفرعي للرقم ${phoneNumber} بنجاح.` }, { quoted: msg });
                } catch (error) {
                    return sock.sendMessage(from, { text: `❌ حدث خطأ أثناء الحذف: ${error.message}` }, { quoted: msg });
                }
            } else {
                return sock.sendMessage(from, { text: `❌ لا توجد نسخة فرعية مثبتة حالياً للرقم ${phoneNumber}` }, { quoted: msg });
            }
        }

        // جلب رقم الهاتف الخاص بك للتنصيب الآمن
        const phoneNumber = from.split('@')[0];
        const statusMsg = await sock.sendMessage(from, { 
            text: `🔄 *عملية التنصيب الذكي بدأت الحين..*\n\n⏳ جاري تجميع الملفات وعزل بيئة العمل للرقم [ ${phoneNumber} ]...` 
        }, { quoted: msg });

        const updateStatus = async (newStatus) => {
            await sock.sendMessage(from, { text: newStatus, edit: statusMsg.key }).catch(() => {});
        };

        try {
            const connectionFolderPath = await createNewConnectionFile(phoneNumber);
            await updateStatus(`🔄 *حالة التنصيب:*\n\n✅ تم بناء ملف الاتصال والبيئة الفردية بنجاح.\n⏳ جاري بدء تشغيل السيرفر الداخلي واستدعاء كود الاقتران...`);
            
            await startNewBot(connectionFolderPath, phoneNumber, sock, msg);
            await updateStatus(`🔄 *حالة التنصيب:*\n\n⏳ السيرفر الفرعي يعمل حالياً في الخلفية.. جاري انتظار التقاط كود الاقتران من خوادم واتساب الموثقة (قد يستغرق الأمر ثواني)...`);

            const pairingCodePath = path.join(process.cwd(), 'pairing_code.txt');
            
            let checkInterval = setInterval(async () => {
                if (fs.existsSync(pairingCodePath)) {
                    try {
                        const pairingInfo = JSON.parse(fs.readFileSync(pairingCodePath, 'utf8'));
                        if (pairingInfo && pairingInfo.code) {
                            clearInterval(checkInterval);
                            await updateStatus(`🔐 *تم التقاط كود الاقتران بنجاح للنسخة الجديدة!*\n\n🔢 كود الربط الخاص بك هو:\n*${pairingInfo.code}*\n\n💡 *طريقة التفعيل:*\nادخل على الإعدادات -> الأجهزة المرتبطة -> ربط برقم الهاتف، ثم أدخل هذا الكود ليشتغل البوت!`);
                            if (fs.existsSync(pairingCodePath)) fs.unlinkSync(pairingCodePath);
                        }
                    } catch (e) {}
                }
            }, 2000);

            setTimeout(() => { clearInterval(checkInterval); }, 120000);

        } catch (error) {
            await updateStatus(`❌ *فشلت عملية التنصيب الفرعية:*\nالسبب: ${error.message}`);
        }
    }
};

