const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const sentVideos = new Set();

module.exports = {
  command: 'ايد',
  category: 'media',
  description: '🎬 يرسل أفضل فيديو Anime Edit من TikTok أو YouTube.',
  usage: '.ايد [اسم الأنمي]',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
    const args = body.trim().split(/\s+/).slice(1);
    const query = args.join(' ');
    const searchText = query ? `anime edit ${query}` : 'anime edit';

    // تفاعل سريع
    await sock.sendMessage(chatId, { react: { text: '🎬', key: msg.key } });

    // --- محاولة 1: TikTok ---
    try {
      const { data } = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(searchText)}`);
      const results = data.data;

      if (results?.length > 0) {
        const fresh = results.filter(v => !sentVideos.has(v.nowm));
        if (fresh.length > 0) {
          // ترتيب حسب الأكثر مشاهدة
          fresh.sort((a, b) => (b.play || 0) - (a.play || 0));
          const vid = fresh[0];
          sentVideos.add(vid.nowm);

          const caption = `
╔═━───── ✦ ─────━═╗
✨🎬  أنمي Edit: ${query || 'عشوائي'} ✨
🔗  المصدر: TikTok 💫
🙋‍♂️  طلبه: @${msg.pushName || 'المستخدم'}
💌  من تصميم مـــجـــهـــول⊰𝑩𝑶𝑻
╚═━───── ✦ ─────━═╝
`;
          return await sock.sendMessage(chatId, { video: { url: vid.nowm }, caption }, { quoted: msg });
        }
      }
    } catch (err) {
      console.warn('*فشل TikTok، سيتم الانتقال إلى YouTube.*');
    }

    // --- محاولة 2: YouTube yt-dlp ---
    try {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edit-'));
      const outPath = path.join(tmpDir, 'video.%(ext)s');
      const command = `yt-dlp "ytsearch3:${searchText}" -f "bestvideo[ext=mp4]+bestaudio/best" -o "${outPath}" --quiet --no-warnings`;
      execSync(command);

      const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.mp4'));
      if (files.length === 0) throw new Error('لا يوجد ملفات فيديو.');

      const videoPath = path.join(tmpDir, files[0]);
      const caption = `
╔═━───── ✦ ─────━═╗
✨🎬  أنمي Edit: ${query || 'عشوائي'} ✨
🔗  المصدر: YouTube 💫
🙋‍♂️  طلبه: @${msg.pushName || 'المستخدم'}
💌  من تصميم مـــجـــهـــول⊰𝑩𝑶𝑻
╚═━───── ✦ ─────━═╝
`;

      await sock.sendMessage(chatId, { video: fs.readFileSync(videoPath), caption }, { quoted: msg });
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (err) {
      console.error('❌ خطأ في YouTube:', err.message);
      await sock.sendMessage(chatId, {
        text: '❌ فشل تحميل الفيديو من TikTok و YouTube.\n📌 تأكد أن yt-dlp مثبت ومحدث.',
        quoted: msg
      });
    }
  }
};