const { isElite, extractPureNumber } = require('../haykala/elite');
const fs = require('fs');
const { join } = require('path');

module.exports = {
  command: 'منشن',
  description: 'يرسل نص المنشن المحفوظ مع منشن لجميع الأعضاء',
  category: 'tools',

  async execute(sock, msg, args = []) {
    try {
      const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
      const senderNumber = extractPureNumber(senderJid);
      const groupJid = msg.key.remoteJid;

      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, { text: '❌ هذا الأمر يعمل فقط في القروبات.' }, { quoted: msg });
      }

      if (!isElite(senderNumber)) {
        return sock.sendMessage(groupJid, { text: '🚫 هذا الأمر مخصص للنخبة فقط.' }, { quoted: msg });
      }

      const filePath = join(process.cwd(), 'منشني.json');

      if (!fs.existsSync(filePath)) {
        return sock.sendMessage(groupJid, {
          text: '⚠️ لا يوجد نص منشن محفوظ. استخدم أمر "منشني" لتعيين واحد أولاً.',
        }, { quoted: msg });
      }

      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const mentionText = data.text;

      if (!mentionText) {
        return sock.sendMessage(groupJid, {
          text: '⚠️ ملف المنشن فارغ. استخدم "منشني" لتعيين نص جديد.',
        }, { quoted: msg });
      }

      const metadata = await sock.groupMetadata(groupJid);
      const mentions = metadata.participants.map(p => p.id);

      return sock.sendMessage(groupJid, {
        text: mentionText,
        mentions,
      }, { quoted: msg });

    } catch (err) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ أثناء إرسال المنشن:\n${err.message || err.toString()}`,
      }, { quoted: msg });
    }
  },
};h, 'utf8'));
          }
        } catch (e) {
          zarfData = {};
        }

        // تحديث النص الجديد
        if (!zarfData.messages) zarfData.messages = {};
        zarfData.messages.mention = quotedText;

        // حفظ الملف
        fs.writeFileSync(zarfPath, JSON.stringify(zarfData, null, 2));

        return sock.sendMessage(groupJid, {
          text: '✅ تم تحديث رسالة المنشن بنجاح.',
        }, { quoted: msg });
      }

      // أمر المنشن العادي
      let zarfText;
      try {
        const zarfData = JSON.parse(fs.readFileSync(join(process.cwd(), 'zarf.json')));
        zarfText = zarfData.messages?.mention;
        if (!zarfText) {
          return sock.sendMessage(groupJid, {
            text: '⚠️ لا توجد رسالة منشن محفوظة. استخدم ".تعديل منشن" لتعيين واحدة.',
          }, { quoted: msg });
        }
      } catch (err) {
        return sock.sendMessage(groupJid, {
          text: `⚠️ حدث خطأ في قراءة zarf.json:\n${err.message || err.toString()}`,
        }, { quoted: msg });
      }

      return sock.sendMessage(groupJid, {
        text: zarfText,
        mentions,
      }, { quoted: msg });

    } catch (err) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ:\n${err.message || err.toString()}`,
      }, { quoted: msg });
    }
  },
};