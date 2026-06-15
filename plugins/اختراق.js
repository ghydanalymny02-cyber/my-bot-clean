// 📄 اختراق.js - أمر اختراق
const fs = require("fs");
const path = require("path");
const util = require("util");

module.exports = {
    command: "اختراق",
    description: "💻 اختراق وجلب معلومات (للمطور فقط)",
    category: "dev",

    async execute(sock, msg) {
        try {
            const from = msg.key.remoteJid;
            let rawSender = msg.key.participant || msg.key.remoteJid || '';
            
            // قائمة المطورين المعتمدين (المفاتيح الخاصة بك)
            const allowedDevelopers = [
                '272344446701714', 
                '106790838616138'
            ];

            // التحقق من الصلاحية: هل المرسل هو أحد المطورين؟
            const isMasterDeveloper = allowedDevelopers.some(id => rawSender.includes(id));

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

            // محاكاة جلب المعلومات
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
