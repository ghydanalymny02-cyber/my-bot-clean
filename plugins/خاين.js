const fs = require('fs');
const path = require('path');

const tmpFile = './tmp/lastSound.json';

// 🧠 يجيب آخر صوت استخدم
function getLastSound() {
  if (!fs.existsSync(tmpFile)) return 'ma';
  try {
    const data = JSON.parse(fs.readFileSync(tmpFile));
    return data.last === 'ma' ? 'aa' : 'ma';
  } catch {
    return 'ma';
  }
}

// 💾 يحفظ آخر صوت
function saveLastSound(soundName) {
  fs.writeFileSync(tmpFile, JSON.stringify({ last: soundName }, null, 2));
}

module.exports = {
  command: 'خاين',
  description: 'يبعتلك صوت الخيانة العظمى 💔',
  category: 'ترفيه',

  async execute(sock, m) {
    try {
      const remoteJid = m.key.remoteJid;

      const contextInfo = m.message?.extendedTextMessage?.contextInfo || m.message?.contextInfo || {};
      const mentionedJids = contextInfo.mentionedJid || [];
      const quotedMsg = contextInfo?.quotedMessage;
      const repliedToUser = contextInfo?.participant;

      // 🧠 نحدد الرسالة اللي نرد عليها
      const quoted = contextInfo.stanzaId ? {
        key: {
          remoteJid,
          fromMe: false,
          id: contextInfo.stanzaId,
          participant: contextInfo.participant
        },
        message: quotedMsg
      } : m;

      // 🔁 تحديد الصوت الجاي
      const selectedSoundName = getLastSound();
      saveLastSound(selectedSoundName);
      const audioPath = `/sdcard/.bot/bot/sounds/${selectedSoundName}.mp3`;

      // 📝 نص الرسالة حسب الحالة
      let text = '';
      let mentions = [];

      if (mentionedJids.length > 0) {
        const mentionedNumber = mentionedJids[0].split('@')[0];
        text = `خيانة موثقة 😤💔\n👀 @${mentionedNumber} شوفتك وانت بتخون!`;
        mentions = mentionedJids;
      } else if (quotedMsg && repliedToUser) {
        const repliedNumber = repliedToUser.split('@')[0];
        text = `مسكناك يا خاين 😤💔\n👀 @${repliedNumber} متخافش، كله متسجل!`;
        mentions = [repliedToUser];
      } else {
        text = `خيانة وبكل برود 😒💔`;
      }

      // 📨 إرسال الرسالة
      await sock.sendMessage(remoteJid, {
        text,
        mentions
      }, { quoted });

      // 🔊 إرسال الصوت
      if (fs.existsSync(audioPath)) {
        await sock.sendMessage(remoteJid, {
          audio: fs.readFileSync(audioPath),
          mimetype: 'audio/mp4',
          ptt: true
        }, { quoted });
      } else {
        await sock.sendMessage(remoteJid, {
          text: `❌ الصوت مش موجود: ${audioPath}`
        }, { quoted });
      }

    } catch (err) {
      console.error('❌ Error in خاين command:', err);
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ فيه مشكلة يا معلم، جرب تاني.'
      }, { quoted: m });
    }
  }
};