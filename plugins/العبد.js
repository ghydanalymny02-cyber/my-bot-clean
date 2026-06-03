const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'العبد',
  description: '🎤 إرسال صوت الحضور',
  category: 'ترفيه',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const audioPath = path.join(__dirname, '../sounds/IN.mp3'); // ← ملف الصوت

    try {
      if (!fs.existsSync(audioPath)) {
        return await sock.sendMessage(
          jid,
          { text: '❌ ملف الصوت مش موجود يا معلم.' },
          { quoted: msg }
        );
      }

      const audioBuffer = fs.readFileSync(audioPath);

      await sock.sendMessage(
        jid,
        {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: false, // مش فويس نوت، ملف صوت عادي
          contextInfo: {
            isForwarded: true,
            forwardingScore: 50,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "@newsletter",
              newsletterName: "❅𝑂⃝🩸𝒀𝑼𝑴𝑰𝑳𝑨",
              serverMessageId: 888
            }
          }
        },
        { quoted: msg } // ← هنا هيخلي الصوت يتبعت كريبلاي
      ).catch(() => {});

    } catch (err) {
      console.error('✗✗ خطأ في أمر العبد:', err);
      await sock.sendMessage(
        jid,
        { text: '❌ حصل خطأ أثناء إرسال الصوت.' },
        { quoted: msg }
      );
    }
  }
};