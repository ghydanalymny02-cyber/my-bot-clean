const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { spawn } = require('child_process');
const { PassThrough } = require('stream');

const decorate = (text) => `❴✾❵──━━━━❨🌋❩━━━━──❴✾❵\n*${text}*\n❴✾❵──━━━━❨🌋❩━━━━──❴✾❵`;

module.exports = {
  command: 'لصوتي',
  description: 'يحوّل رسالة صوتية إلى مقطع صوتي mp3.',
  async execute(sock, m) {
    try {
      const contextInfo = m.message?.extendedTextMessage?.contextInfo;
      const quotedMsg = contextInfo?.quotedMessage;
      
      // تحقق من وجود رسالة صوتية أو voice note
      const audioMsg = quotedMsg?.audioMessage || quotedMsg?.voiceMessage;
      if (!audioMsg) {
        return await sock.sendMessage(m.key.remoteJid, {
          text: decorate('🎵 يرجى الرد على رسالة صوتية لتحويلها.')
        }, { quoted: m });
      }

      // تحميل الميديا
      const stream = await downloadContentFromMessage(audioMsg, 'audio');
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

      if (!buffer.length) {
        return await sock.sendMessage(m.key.remoteJid, {
          text: decorate('❌ فشل تحميل الرسالة الصوتية.')
        }, { quoted: m });
      }

      // تحويل الصوت باستخدام ffmpeg إلى MP3
      const ffmpeg = spawn('ffmpeg', [
        '-i', 'pipe:0',       // input من stdin
        '-f', 'mp3',
        '-codec:a', 'libmp3lame',
        '-q:a', '2',
        'pipe:1'              // output إلى stdout
      ]);

      const outputStream = new PassThrough();
      ffmpeg.stdout.pipe(outputStream);

      ffmpeg.stdin.write(buffer);
      ffmpeg.stdin.end();

      const chunks = [];
      outputStream.on('data', chunk => chunks.push(chunk));

      outputStream.on('end', async () => {
        const audioBuffer = Buffer.concat(chunks);

        await sock.sendMessage(m.key.remoteJid, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg', // MP3
        }, { quoted: m });
      });

      ffmpeg.stderr.on('data', data => {
        console.error('FFmpeg Error:', data.toString());
      });

      ffmpeg.on('error', async (err) => {
        console.error(err);
        await sock.sendMessage(m.key.remoteJid, {
          text: decorate('❌ حدث خطأ أثناء تحويل الرسالة الصوتية.')
        }, { quoted: m });
      });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(m.key.remoteJid, {
        text: decorate('❌ حدث خطأ أثناء معالجة الأمر.')
      }, { quoted: m });
    }
  }
};