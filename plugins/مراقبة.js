// 📄 مراقبة-المطورين.js - يراقب المطورين ويتفاعل مع رسائلهم

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'مراقبة المطورين',
    version: '1.0',
    author: 'النظام',
    description: 'يراقب المطورين ويتفاعل مع رسائلهم تلقائياً',
    
    async execute(sock, msg, args) {
        const info = `
╭──〔 👑 مراقبة المطورين 〕──╮
┃
┃ 🔍 *النظام نشط ويراقب:*
┃ 👑 @967733032585
┃ 👑 @967715677073
┃
┃ ⏱️ *المراقبة:* كل ثانية
┃ 🎯 *المهمة:* تفاعل تلقائي مع رسائلهم
┃ 🎭 *الرموز:* 🛡️ 👑 🔰 🥶 👿 😈
┃ 📊 *الحالة:* ✅ مراقبة نشطة
┃
┃ 📈 *إحصائيات المراقبة:*
┃ • رسائل المطورين: ${global.devMessagesCount || 0}
┃ • تفاعلات مرسلة: ${global.devReactionsCount || 0}
┃ • آخر نشاط: ${global.lastDevActivity || 'لم يتم بعد'}
┃
╯━━━━━━━━━━━━━━╰

👁️ *النظام يراقب المطورين 24/7*
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: info
        }, { quoted: msg });
    },
    
    command: 'مراقبة',
    usage: '.مراقبة',
    category: 'النظام',
    
    // قائمة المطورين
    developers: ['967733032585', '967715677073'],
    
    // ذاكرة مؤقتة للمراقبة
    monitoringData: {
        lastChecked: null,
        messageCount: 0,
        reactionsSent: 0,
        active: true
    },
    
    // دالة البدء
    async onStart(sock) {
        console.log('👑 نظام مراقبة المطورين مفعل');
        console.log('⏱️ سيراقب المطورين كل ثانية');
        
        // بدء المراقبة الدورية
        this.startMonitoring(sock);
        
        // مراقبة الرسائل في الوقت الفعلي أيضاً
        this.setupRealTimeMonitoring();
    },
    
    // بدء المراقبة الدورية
    startMonitoring(sock) {
        // التحقق كل ثانية
        setInterval(async () => {
            try {
                await this.checkForDeveloperMessages(sock);
            } catch (error) {
                console.error('❌ خطأ في المراقبة:', error);
            }
        }, 1000); // كل 1000 مللي ثانية = 1 ثانية
        
        console.log('✅ بدأت المراقبة الدورية (كل ثانية)');
    },
    
    // مراقبة في الوقت الفعلي
    setupRealTimeMonitoring() {
        // تخزين عالمي للرسائل الأخيرة
        global.recentMessages = global.recentMessages || [];
        global.devMessagesCount = global.devMessagesCount || 0;
        global.devReactionsCount = global.devReactionsCount || 0;
        global.lastDevActivity = global.lastDevActivity || 'لم يتم بعد';
        
        console.log('👁️ جاهز لمراقبة الرسائل الفورية');
    },
    
    // دالة المراقبة الرئيسية
    async checkForDeveloperMessages(sock) {
        try {
            // تحديث وقت آخر فحص
            this.monitoringData.lastChecked = new Date();
            
            // هنا يمكنك إضافة منطق لفحص الرسائل الجديدة
            // لكننا نعتمد على onMessage للرسائل الفورية
            
        } catch (error) {
            console.error('❌ خطأ في فحص الرسائل:', error);
        }
    },
    
    // معالج الرسائل - يتفاعل مع رسائل المطورين فورياً
    async onMessage(sock, msg) {
        try {
            // تجاهل الرسائل من البوت نفسه
            if (msg.key.fromMe) return false;
            
            const chatId = msg.key.remoteJid;
            
            // الحصول على ID المرسل
            let senderId = '';
            if (msg.key.participant) {
                senderId = msg.key.participant.split('@')[0];
            } else if (chatId.includes('@s.whatsapp.net')) {
                senderId = chatId.split('@')[0];
            } else {
                senderId = chatId.split('@')[0];
            }
            
            // التحقق إذا كان المطور
            const isDeveloper = this.developers.includes(senderId);
            
            if (isDeveloper) {
                // تحديث الإحصائيات
                global.devMessagesCount = (global.devMessagesCount || 0) + 1;
                global.lastDevActivity = new Date().toLocaleString('ar-SA');
                
                // حفظ الرسالة الأخيرة
                global.lastDevMessage = {
                    id: senderId,
                    time: new Date(),
                    text: msg.message?.conversation || 'وسائط'
                };
                
                console.log(`👑 رسالة من المطور: ${senderId}`);
                
                // === التفاعل مع رسالة المطور ===
                await this.reactToDeveloperMessage(sock, msg, senderId);
                
                // === إرسال ردود إضافية (40% فرصة) ===
                if (Math.random() < 0.4) {
                    await this.sendAdditionalResponse(sock, msg, senderId);
                }
                
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('❌ خطأ في مراقبة الرسالة:', error);
            return false;
        }
    },
    
    // تفاعل مع رسالة المطور
    async reactToDeveloperMessage(sock, msg, developerId) {
        try {
            // رموز خاصة للمطورين
            const devSymbols = ['👑', '🛡️', '🔰', '⚡', '🔥', '💎', '🌟', '✨'];
            
            // اختيار 1-4 رموز
            const numReacts = Math.floor(Math.random() * 4) + 1;
            const selectedSymbols = [];
            
            for (let i = 0; i < numReacts; i++) {
                const symbol = devSymbols[Math.floor(Math.random() * devSymbols.length)];
                if (!selectedSymbols.includes(symbol)) {
                    selectedSymbols.push(symbol);
                }
            }
            
            // إرسال التفاعلات بالتتابع
            for (let i = 0; i < selectedSymbols.length; i++) {
                setTimeout(async () => {
                    try {
                        await sock.sendMessage(msg.key.remoteJid, {
                            react: { text: selectedSymbols[i], key: msg.key }
                        });
                        
                        // تحديث عداد التفاعلات
                        global.devReactionsCount = (global.devReactionsCount || 0) + 1;
                        
                    } catch (error) {
                        console.error('❌ خطأ في التفاعل:', error);
                    }
                }, i * 600);
            }
            
            // تسجيل النشاط
            this.logDeveloperActivity(developerId, selectedSymbols);
            
        } catch (error) {
            console.error('❌ خطأ في تفاعل المطور:', error);
        }
    },
    
    // إرسال ردود إضافية
    async sendAdditionalResponse(sock, msg, developerId) {
        try {
            // أنواع الردود الإضافية
            const additionalResponses = [
                {
                    type: 'text',
                    content: '👑 *تم الاستلام يا سيدي*',
                    delay: 1500
                },
                {
                    type: 'text',
                    content: '⚡ *رسالتك في أعلى الأولويات*',
                    delay: 2500
                },
                {
                    type: 'text',
                    content: '🔰 *النظام تحت خدمتك*',
                    delay: 3500
                },
                {
                    type: 'react',
                    symbol: '💎',
                    delay: 2000
                },
                {
                    type: 'react',
                    symbol: '🌟',
                    delay: 3000
                }
            ];
            
            // اختيار 1-2 ردود إضافية
            const numResponses = Math.floor(Math.random() * 2) + 1;
            const selectedResponses = [];
            
            for (let i = 0; i < numResponses; i++) {
                const response = additionalResponses[Math.floor(Math.random() * additionalResponses.length)];
                if (!selectedResponses.find(r => r.delay === response.delay)) {
                    selectedResponses.push(response);
                }
            }
            
            // إرسال الردود الإضافية
            selectedResponses.forEach(response => {
                setTimeout(async () => {
                    try {
                        if (response.type === 'text') {
                            await sock.sendMessage(msg.key.remoteJid, {
                                text: response.content
                            });
                        } else if (response.type === 'react') {
                            await sock.sendMessage(msg.key.remoteJid, {
                                react: { text: response.symbol, key: msg.key }
                            });
                        }
                    } catch (error) {
                        // تجاهل الأخطاء في الردود الإضافية
                    }
                }, response.delay);
            });
            
        } catch (error) {
            console.error('❌ خطأ في الرد الإضافي:', error);
        }
    },
    
    // تسجيل نشاط المطور
    logDeveloperActivity(developerId, symbols) {
        const logFile = path.join(__dirname, '../dev_monitor_log.json');
        const logEntry = {
            developer: developerId,
            timestamp: new Date().toISOString(),
            reactions: symbols,
            type: 'auto_react'
        };
        
        try {
            let logs = [];
            if (fs.existsSync(logFile)) {
                logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
            }
            
            logs.push(logEntry);
            
            // حفظ آخر 500 سجل فقط
            if (logs.length > 500) {
                logs = logs.slice(-500);
            }
            
            fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf8');
            
        } catch (error) {
            console.error('❌ خطأ في تسجيل النشاط:', error);
        }
    },
    
    // الحصول على إحصائيات المراقبة
    getMonitoringStats() {
        return {
            active: this.monitoringData.active,
            lastChecked: this.monitoringData.lastChecked,
            messageCount: this.monitoringData.messageCount,
            reactionsSent: this.monitoringData.reactionsSent,
            developers: this.developers,
            globalStats: {
                devMessages: global.devMessagesCount || 0,
                devReactions: global.devReactionsCount || 0,
                lastActivity: global.lastDevActivity || 'لا يوجد'
            }
        };
    }
};