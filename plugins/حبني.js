const fs = require('fs');
const path = require('path');

// تحميل العبارات العشوائية بدون تكرار
function loadRandomMessage() {
  const messagesPath = path.join(__dirname, '..', 'data', 'loveMessages.json');
  const statePath = path.join(__dirname, '..', 'data', 'loveState.json');

  if (!fs.existsSync(messagesPath)) {
    const defaultMessages = [
      "بحبك قوي يا {name} ❤️",
      "يا {name}، انت كل حاجة حلوة في حياتي 💖",
      "مين زيك يا {name}؟ مفيش والله 💌",
      "احبك قد السماء يا {name} ✨"
    ];
    fs.writeFileSync(messagesPath, JSON.stringify(defaultMessages, null, 2));
  }

  const allMessages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
  let remainingMessages = [];

  if (fs.existsSync(statePath)) {
    remainingMessages = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
  }

  if (!Array.isArray(remainingMessages) || remainingMessages.length === 0) {
    remainingMessages = [...allMessages];
  }

  const index = Math.floor(Math.random() * remainingMessages.length);
  const selected = remainingMessages.splice(index, 1)[0];
  fs.writeFileSync(statePath, JSON.stringify(remainingMessages, null, 2));

  return selected;
}

module.exports = {
  command: 'حبني',
  description: 'أمر كيوت يعبّر عن الحب 🩷',
  category: 'ترفيه',

  async execute(sock, msg) {
    try {
      const imagePath = path.join(__dirname, '..', 'media', 'love.gif');

      let targetJid = null;
      let targetName = null;

      const mentions = msg.mentionedJid || [];
      const isReply = msg.message?.extendedTextMessage?.contextInfo?.participant;

      // ✅ لو فيه منشن
      if (mentions.length > 0) {
        targetJid = mentions[0];
        targetName = `@${targetJid.split('@')[0]}`;
      }

      // ✅ لو فيه ريبلاي
      else if (isReply) {
        targetJid = msg.message.extendedTextMessage.contextInfo.participant;

        const quotedMessage = msg.message.extendedTextMessage.contextInfo;
        if (quotedMessage?.quotedMessage?.conversation) {
          targetName = quotedMessage?.participant
            ? `@${quotedMessage.participant.split('@')[0]}`
            : '@واحد';
        } else {
          targetName = `@${targetJid.split('@')[0]}`;
        }
      }

      // ✅ لو مفيش لا منشن ولا ريبلاي
      else {
        targetJid = msg.key.participant || msg.key.remoteJid;
        targetName = msg.pushName || `@${targetJid.split('@')[0]}`;
      }

      // 🩷 نركب الرسالة
      let message = loadRandomMessage();
      message = message.replace('{name}', targetName);

      // إرسال الرسالة
      if (fs.existsSync(imagePath)) {
        const media = fs.readFileSync(imagePath);
        await sock.sendMessage(msg.key.remoteJid, {
          video: media,
          gifPlayback: true,
          caption: message,
          mentions: [targetJid]
        }, { quoted: msg });
      } else {
        await sock.sendMessage(msg.key.remoteJid, {
          text: message,
          mentions: [targetJid]
        }, { quoted: msg });
      }

    } catch (err) {
      console.error('✗✗ خطأ في أمر احبك:', err.message);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ في مشكلة في أمر "احبك"، اتأكد إن كل حاجة تمام.'
      }, { quoted: msg });
    }
  }
};