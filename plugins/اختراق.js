// 📄 اختراق.js - أمر اختراق حقيقي للمطور
const fs = require("fs");
const path = require("path");
const os = require("os");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

// قائمة المطورين
const DEVELOPERS = [
    "963996097873", // المطور الأساسي
    "963996097873",
    "178817339498583"
];

module.exports = {
    name: "اختراق",
    aliases: ["hack", "قرصنة", "هكر", "اخنراق", "تجسس"],
    description: "💻 اختراق وجلب معلومات حقيقية (للمطور فقط)",
    category: "dev",

    run: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;
            const sender = msg.key.participant || msg.participant || from;
            const senderNumber = sender.split('@')[0];

            // التحقق من أن المستخدم مطور
            if (!DEVELOPERS.includes(senderNumber)) {
                return await sock.sendMessage(from, { 
                    text: "❌ هذا الأمر للمطورين فقط" 
                });
            }

            // التحقق من وجود منشن
            const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            
            if (mentionedJids.length === 0) {
                return await sock.sendMessage(from, { 
                    text: "❌ استخدم: اختراق @منشن\nمثال: اختراق @المجرم" 
                });
            }

            const targetJid = mentionedJids[0];
            const targetNumber = targetJid.split('@')[0];

            await sock.sendMessage(from, { 
                text: `🔍 *بدء اختراق @${targetNumber}...*\n⏳ الرجاء الانتظار`,
                mentions: [targetJid]
            });

            // ======================================================
            // 🔥 جلب معلومات حقيقية عن الرقم
            // ======================================================

            // 1. معلومات من واتساب
            await sock.sendMessage(from, { text: "📡 *جلب بيانات واتساب...*" });
            await new Promise(resolve => setTimeout(resolve, 1500));

            let waInfo = "❌ غير متاح";
            try {
                const [info] = await sock.onWhatsApp(targetJid);
                if (info) {
                    waInfo = 
                        `✅ *معلومات واتساب:*\n` +
                        `• موجود: ${info.exists ? 'نعم' : 'لا'}\n` +
                        `• JID: ${info.jid}\n` +
                        `• حساب أعمال: ${info.isBusiness ? 'نعم' : 'لا'}`;
                }
            } catch (e) {}

            // 2. معلومات من صورة البروفايل
            await sock.sendMessage(from, { text: "🖼️ *جلب صورة البروفايل...*" });
            await new Promise(resolve => setTimeout(resolve, 1500));

            let profileUrl = "❌ غير متاح";
            try {
                const ppUrl = await sock.profilePictureUrl(targetJid, 'image');
                if (ppUrl) {
                    profileUrl = ppUrl;
                }
            } catch (e) {}

            // 3. معلومات المجموعات المشترك فيها
            await sock.sendMessage(from, { text: "👥 *جلب المجموعات المشترك فيها...*" });
            await new Promise(resolve => setTimeout(resolve, 2000));

            let groupsInfo = "❌ غير متاح";
            try {
                const groups = await sock.groupFetchAllParticipating();
                const userGroups = [];
                
                for (const [id, group] of Object.entries(groups)) {
                    if (group.participants.some(p => p.id === targetJid)) {
                        userGroups.push(`• ${group.subject} (${id.split('@')[0]})`);
                    }
                }
                
                if (userGroups.length > 0) {
                    groupsInfo = `✅ *موجود في ${userGroups.length} مجموعة:*\n${userGroups.slice(0, 5).join('\n')}`;
                    if (userGroups.length > 5) {
                        groupsInfo += `\n... و${userGroups.length - 5} مجموعة أخرى`;
                    }
                }
            } catch (e) {}

            // 4. معلومات IP وهمية (لأنه ما في طريقة حقيقية)
            const fakeIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            
            // 5. موقع تقريبي (حسب الرقم)
            const countries = [
                "مصر", "السعودية", "الإمارات", "الكويت", "قطر", 
                "البحرين", "عمان", "الأردن", "فلسطين", "لبنان",
                "سوريا", "العراق", "اليمن", "ليبيا", "تونس",
                "الجزائر", "المغرب", "السودان", "موريتانيا"
            ];
            
            // تحديد موقع حسب الرقم (تمثيلي)
            let country = "غير معروف";
            if (targetNumber.startsWith("963")) country = "سوريا";
            else if (targetNumber.startsWith("966")) country = "السعودية";
            else if (targetNumber.startsWith("962")) country = "الأردن";
            else if (targetNumber.startsWith("971")) country = "الإمارات";
            else if (targetNumber.startsWith("974")) country = "قطر";
            else if (targetNumber.startsWith("965")) country = "الكويت";
            else if (targetNumber.startsWith("973")) country = "البحرين";
            else if (targetNumber.startsWith("968")) country = "عمان";
            else if (targetNumber.startsWith("20")) country = "مصر";
            else country = countries[Math.floor(Math.random() * countries.length)];

            // 6. جهاز وهمي
            const devices = [
                "iPhone 14 Pro Max", "Samsung Galaxy S23 Ultra", "Google Pixel 7 Pro",
                "Xiaomi 13 Pro", "OnePlus 11", "Huawei P60 Pro", "iPhone 13",
                "Samsung A54", "Realme GT 3", "Nothing Phone 2", "iPad Pro",
                "MacBook Pro", "Windows 11 PC", "Linux Server"
            ];
            const device = devices[Math.floor(Math.random() * devices.length)];

            // 7. متصفح وهمي
            const browsers = [
                "Chrome 121", "Firefox 122", "Safari 17", "Edge 120",
                "Opera 106", "Brave 1.61", "Vivaldi 6.5"
            ];
            const browser = browsers[Math.floor(Math.random() * browsers.length)];

            // 8. كلمات مرور وهمية
            const passwords = [
                "123456", "password", "qwerty123", "admin123", "love2024",
                "kora2025", "mama1234", "baba5678", "secret123", "000000"
            ];
            const password = passwords[Math.floor(Math.random() * passwords.length)];

            // 9. معلومات نظام حقيقية من البوت (للمطور)
            const botUptime = process.uptime();
            const botMemory = process.memoryUsage();

            // ======================================================
            // 🔥 بناء تقرير الاختراق
            // ======================================================

            const hackReport = 
                `╭━━━━━━━━━━━━━━━━━━╮\n` +
                `┃   💀 *تقرير الاختراق* 💀   ┃\n` +
                `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
                
                `🎯 *الهدف:* @${targetNumber}\n` +
                `⏰ *الوقت:* ${new Date().toLocaleString('ar-EG')}\n\n` +
                
                `━━━━━━━━━━━━━━━━━━\n` +
                `📱 *المعلومات الشخصية*\n` +
                `━━━━━━━━━━━━━━━━━━\n\n` +
                
                `• *الموقع:* ${country}\n` +
                `• *IP:* ${fakeIP}\n` +
                `• *الجهاز:* ${device}\n` +
                `• *المتصفح:* ${browser}\n` +
                `• *كلمة المرور:* ${password}\n\n` +
                
                `━━━━━━━━━━━━━━━━━━\n` +
                `📞 *معلومات واتساب*\n` +
                `━━━━━━━━━━━━━━━━━━\n\n` +
                
                `${waInfo}\n\n` +
                `• *صورة البروفايل:* ${profileUrl !== "❌ غير متاح" ? '✅ متوفرة' : '❌ خاصة'}\n\n` +
                
                `━━━━━━━━━━━━━━━━━━\n` +
                `👥 *المجموعات*\n` +
                `━━━━━━━━━━━━━━━━━━\n\n` +
                
                `${groupsInfo}\n\n` +
                
                `━━━━━━━━━━━━━━━━━━\n` +
                `🕵️ *معلومات إضافية*\n` +
                `━━━━━━━━━━━━━━━━━━\n\n` +
                
                `• *حالة الحساب:* ${Math.random() > 0.5 ? 'نشط' : 'غير نشط'}\n` +
                `• *آخر ظهور:* ${Math.floor(Math.random() * 60)} دقيقة\n` +
                `• *الجهات المتصلة:* ${Math.floor(Math.random() * 500) + 50}\n` +
                `• *الوسائط المرسلة:* ${Math.floor(Math.random() * 1000)}\n\n` +
                
                `━━━━━━━━━━━━━━━━━━\n` +
                `🤖 *معلومات البوت*\n` +
                `━━━━━━━━━━━━━━━━━━\n\n` +
                `• *وقت التشغيل:* ${Math.floor(botUptime / 60)} دقيقة\n` +
                `• *الذاكرة:* ${(botMemory.heapUsed / 1024 / 1024).toFixed(2)} MB\n\n` +
                
                `━━━━━━━━━━━━━━━━━━\n` +
                `💀 *تم الاختراق بنجاح* 💀`;

            await sock.sendMessage(from, { 
                text: hackReport,
                mentions: [targetJid]
            });

            // إرسال صورة البروفايل إذا وجدت
            if (profileUrl !== "❌ غير متاح") {
                try {
                    await sock.sendMessage(from, {
                        text: `🖼️ *صورة البروفايل للهدف @${targetNumber}:*`,
                        mentions: [targetJid]
                    });
                } catch (e) {}
            }

            // إرسال سجل الاختراق للمطور الأساسي
            const ownerJid = DEVELOPERS[0] + '@s.whatsapp.net';
            if (from !== ownerJid) {
                await sock.sendMessage(ownerJid, {
                    text: `📊 *سجل اختراق*\n\n` +
                          `👤 المختبرق: @${targetNumber}\n` +
                          `👨‍💻 المخترق: @${senderNumber}\n` +
                          `⏰ الوقت: ${new Date().toLocaleString('ar-EG')}`,
                    mentions: [targetJid, sender]
                });
            }

        } catch (err) {
            console.log("خطأ في أمر اختراق:", err);
            await sock.sendMessage(from, { 
                text: `❌ حدث خطأ: ${err.message}` 
            });
        }
    }
};