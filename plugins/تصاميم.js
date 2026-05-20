const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const sentVideos = new Set();

module.exports = {
  command: 'تصميم',
  category: 'media',
  description: 'يرسل أفضل فيديو Anime Edit من TikTok أو YouTube.',
  usage: '.ايديت [اسم الأنمي]',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
    const args = body.trim().split(/\s+/).slice(1);
    const query = args.join(' ');
    const searchText = query ? `anime edit ${query}` : 'anime edit';

    await sock.sendMessage(chatId, {
      react: { text: '🎬', key: msg.key }
    });

    // المحاولة الأولى: TikTok API
    try {
      const { data } = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(searchText)}`);
      const results = data.data;

      if (results && results.length > 0) {
        const fresh = results.filter(v => !sentVideos.has(v.nowm));
        if (fresh.length > 0) {
          fresh.sort((a, b) => (b.play || 0) - (a.play || 0));
          const vid = fresh[0];
          sentVideos.add(vid.nowm);

          return await sock.sendMessage(chatId, {
            video: { url: vid.nowm },
            caption: `*❐┃تم التنفيذ بنجاح┃✅*\n\n🎬 *أنمي:* ${query || 'عشوائي'}`
          }, { quoted: msg });
        }
      }
    } catch (err) {
      console.warn('*فشل في TikTok، سيتم الانتقال إلى YouTube.*');
    }

    // المحاولة الثانية: YouTube yt-dlp
    try {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edit-'));
      const outPath = path.join(tmpDir, 'video.%(ext)s');
      const command = `yt-dlp "ytsearch1:${searchText}" -f mp4 -o "${outPath}" --quiet --no-warnings`;
      execSync(command);

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
        caption: `*❐┃تم التنفيذ من YouTube┃✅*\n\n🎬 *أنمي:* ${query || 'عشوائي'}`
      }, { quoted: msg });

      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (err) {
      console.error('❌ خطأ في YouTube:', err.message);
      await sock.sendMessage(chatId, {
        text: '❌ فشل تحميل الفيديو من TikTok و YouTube.\n📌 تأكد أن yt-dlp مثبت.',
        quoted: msg
      });
    }
  }
};;