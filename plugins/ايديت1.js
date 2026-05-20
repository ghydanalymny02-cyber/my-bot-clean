const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  command: 'ايديت1',
  category: 'media',
  description: '🎬 يرسل أي فيديو Anime Edit من TikTok أو YouTube بدقة عالية.',
  usage: '.جيب [اسم الفيديو/أنمي]',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
    const args = body.trim().split(/\s+/).slice(1);
    const query = args.join(' ');
    const searchText = query ? `anime edit ${query}` : 'anime edit';
    const senderName = msg.pushName || (msg.key.participant ? msg.key.participant.split('@')[0] : 'المستخدم');

    await sock.sendMessage(chatId, { react: { text: '🎬', key: msg.key } });

    // --- TikTok ---
    try {
      const { data } = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(searchText)}`, { timeout: 10000 });
      const results = data.data;

      if (results?.length > 0) {
        const vid = results[0]; // نأخذ أول نتيجة مباشرة

        const caption = `
╔═━───── ✦ ─────━═╗
✨🎬  أنمي Edit: ${query || 'عشوائي'} ✨
🔗  المصدر: TikTok 💫
🙋‍♂️  طلبه: @${senderName}
💌  من تصميم بوت: 𝑬𝑺𝑪𝑨𝑵𝑶𝑹
╚═━───── ✦ ─────━═╝
`;
        return await sock.sendMessage(chatId, { video: { url: vid.nowm }, caption }, { quoted: msg });
      }
    } catch (err) {
      console.warn('فشل تحميل فيديو TikTok:', err.message);
    }

    // --- YouTube باستخدام yt-dlp ---
    let tmpDir;
    try {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edit-'));
      const outPath = path.join(tmpDir, 'video.%(ext)s');

      // تحميل أول نتيجة من البحث
      const command = `yt-dlp "ytsearch1:${searchText}" -f "bestvideo[ext=mp4]+bestaudio/best" -o "${outPath}" --quiet --no-warnings`;
      execSync(command, { stdio: 'ignore' });

      const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.mp4'));
      if (files.length === 0) throw new Error('لا يوجد ملفات فيديو بعد التحميل.');

      const videoPath = path.join(tmpDir, files[0]);

      const caption = `
╔═━───── ✦ ─────━═╗
✨🎬  أنمي Edit: ${query || 'عشوائي'} ✨
🔗  المصدر: YouTube 💫
🙋‍♂️  طلبه: @${senderName}
💌  من تصميم بوت: 𝑬𝑺𝑪𝑨𝑵𝑶𝑹
╚═━───── ✦ ─────━═╝
`;

      await sock.sendMessage(chatId, { video: fs.readFileSync(videoPath), caption }, { quoted: msg });
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (err) {
      if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
      console.error('YouTube Error:', err.message);
      await sock.sendMessage(chatId, { text: '❌ فشل تحميل الفيديو من TikTok و YouTube.', quoted: msg });
    }
  }
};