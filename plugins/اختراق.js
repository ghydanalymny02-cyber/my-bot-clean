// 📄 اختراق.js - أمر اختراق
const fs = require("fs");
const path = require("path");
const util = require("util");

module.exports = {
    command: "اختراق", // تم تغيير الاسم ليتوافق مع السورس
    description: "💻 اختراق وجلب معلومات (للمطور فقط)",
    category: "dev",

    // تم تغيير اسم الدالة من run إلى execute ليتعرف عليها البوت
    async execute(sock, msg) {
        try {
            const from = msg.key.remoteJid;
            let rawSender = msg.key.participant || msg.key.remoteJid || '';
            const senderNumber = rawSender.split('@')[0];
            
            // الـ LID الخاص بك - مفتاح المطور المعتمد
            const mySecretLid = '272344446701714';
            const isMasterDeveloper = rawSender.includes(mySecretLid) || senderNumber === mySecretLid;

            // التحقق من الصلاحية
            if (!isMasterDeveloper) {
                return await sock.sendMessage(from, { 
                    text: "❌ هذا الأمر للمطور الأساسي فقط" 
                }, { quoted: msg });
            }

            // التحقق من وجود منشن
            const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            
            if (mentionedJids.length === 0) {
                return await sock.sendMessage(from, { 
                    text: "❌ استخدم: .اختراق @منشن" 
                }, { quoted: msg });
            }

            const targetJid = mentionedJids[0];
            const targetNumber = targetJid.split('@')[0];

            await sock.sendMessage(from, { 
                text: `🔍 *بدء اختراق @${targetNumber}...*\n⏳ الرجاء الانتظار`,
                mentions: [targetJid]
            }, { quoted: msg });

            // محاكاة جلب المعلومات (البيانات وهمية للترفيه)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const hackReport = `╭━━━━━━━━━━━━━━━━━━╮\n` +
                               `┃   💀 *تقرير الاختراق* 💀   ┃\n` +
                               `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
                               `🎯 *الهدف:* @${targetNumber}\n` +
                               `• *الموقع:* تم تحديد الموقع (IP: 192.168.1.1)\n` +
                               `• *الجهاز:* كشف نوع الجهاز بنجاح\n` +
                               `• *حالة الحساب:* نشط ✅\n\n` +
                               `💀 *تم الاختراق بنجاح* 💀`;

            await sock.sendMessage(from, { 
                text: hackReport,
                mentions: [targetJid]
            }, { quoted: msg });

        } catch (err) {
            console.log("خطأ في أمر اختراق:", err);
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ حدث خطأ: ${err.message}` 
            }, { quoted: msg });
        }
    }
};
