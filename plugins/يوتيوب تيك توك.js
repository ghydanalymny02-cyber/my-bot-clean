const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  command: 'اايديت',
  category: 'tools',
  description: 'يحمل فيديو أنمي من يوتيوب حسب الاسم',
  usage: '.ايديت [اسم الأنمي]',
  
  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
    const args = body.trim().split(/\s+/).slice(1);
    const query = args.join(' ') || 'anime edit';

    await sock.sendMessage(chatId, {
      text: `🔍 جاري البحث عن: *${query}* ...`,
      quoted: msg
    });

    try {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edit-'));
      const outPath = path.join(tmpDir, 'video.%(ext)s');

      // ✅ بحث من يوتيوب بدلاً من تيك توك
      const command = `yt-dlp "ytsearch1:${query} anime edit" -f mp4 -o "${outPath}" --quiet --no-warnings`;
      execSync(command);

      // ابحث عن أي ملف فيديو في المجلد
      const files = fs.readdirSync(tmpDir).filter(file => file.endsWith('.mp4'));
      if (files.length === 0) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
        return await sock.sendMessage(chatId, {
          text: '⚠️ لم يتم العثور على أي فيديو مناسب.',
          quoted: msg
        });
      }

      const videoPath = path.join(tmpDir, files[0]);

      await sock.sendMessage(chatId, {
        video: fs.readFileSync(videoPath),
        caption: `*❐┃تم التنفيذ بنجاح┃✅*\n\n🎬 *أنمي:* ${query}`
      }, { quoted: msg });

      fs.rmSync(tmpDir, { recursive: true, force: true });

    } catch (err) {
      console.error('❌ خطأ:', err.message);
      await sock.sendMessage(chatId, {
        text: '❌ حدث خطأ أثناء تحميل الفيديو.\n📌 تأكد أن yt-dlp مثبت ويعمل.',
        quoted: msg
      });
    }
  }
};