const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

module.exports = {
  command: ['وصف'],
  description: 'تغيير وصف الجروب (للمشرفين فقط).',
  category: 'group',

  async execute(sock, msg, args = []) {
    try {
      // التحقق من أن الرسالة داخل مجموعة
      if (!msg.key.remoteJid.endsWith('@g.us')) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🚫 هذا الأمر يعمل داخل المجموعات فقط.',
        }, { quoted: msg });
      }

      // التحقق من المشرفين
      const sender = msg.key.participant || msg.key.remoteJid;
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = groupMetadata.participants || [];
      const isAdmin = participants.find(p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin'));

      if (!isAdmin) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ هذا الأمر مخصص للمشرفين فقط.',
        }, { quoted: msg });
      }

      // قراءة الرسالة النصية الكاملة كما في كود "إضافة"
      const fullText =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        '';

      // محاولة قراءة الرد على الرسالة (الوصف الجديد)
      const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      let newDescription = '';

      if (quotedMessage?.conversation) {
        newDescription = quotedMessage.conversation.trim();
      } else if (quotedMessage?.extendedTextMessage?.text) {
        newDescription = quotedMessage.extendedTextMessage.text.trim();
      }

      // إذا لم يتم الرد على رسالة، نأخذ الوصف من نص الرسالة
      if (!newDescription && fullText) {
        const parts = fullText.trim().split(/\s+/);
        if (parts.length > 1) {
          newDescription = parts.slice(1).join(' ');
        }
      }

      if (!newDescription) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '⚠️ يرجى الرد على رسالة أو كتابة الوصف الجديد بعد الأمر.',
        }, { quoted: msg });
      }

      // تحديث الوصف
      const oldDescription = groupMetadata.desc || 'لا يوجد وصف حالي.';
      await sock.groupUpdateDescription(msg.key.remoteJid, newDescription);

      const messageText = `> ✅ تم تغيير وصف الجروب بنجاح\n\n— الوصف القديم:\n*${oldDescription}*\n\n— الوصف الجديد:\n*${newDescription}*`;

      const thumbnail = fs.readFileSync(path.resolve('./image.jpeg'));

      await sock.sendMessage(msg.key.remoteJid, {
        text: messageText,
        contextInfo: {
          externalAdReply: {
            title: 'تم تعديل وصف المجموعة',
            body: 'بواسطة أحد المشرفين',
            mediaType: 2,
            thumbnail,
            sourceUrl: 'nn'
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error('❌ خطأ في أمر تغيير الوصف:', error);
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حدث خطأ أثناء تنفيذ الأمر، يرجى المحاولة لاحقاً.',
      }, { quoted: msg });
    }
  }
};