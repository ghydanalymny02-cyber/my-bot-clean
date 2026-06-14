// 📄 مملكتي.js - أمر لإرسال إطار أنيق باسم المملكة
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  status: "on",
  name: 'مملكتي',
  command: ['مملكتي'],
  category: 'ترفيه',
  description: '🖼️ إرسال إطار مملكة يوميلا مع أرقام النخبة',
  hidden: false,
  version: '1.0',

  async execute(sock, msg) {
    try {
      // إضافة ردة فعل إذا كان هناك ملف zarf.json
      try {
        const zarfPath = path.join(process.cwd(), 'zarf.json');
        if (await fs.access(zarfPath).then(() => true).catch(() => false)) {
          const zarfData = JSON.parse(await fs.readFile(zarfPath, 'utf8'));
          if (zarfData.reaction_status === "on" && zarfData.reaction) {
            await sock.sendMessage(msg.key.remoteJid, {
              react: { text: zarfData.reaction, key: msg.key }
            }).catch(() => {});
          }
        }
      } catch (e) {
        // تجاهل خطأ ملف zarf.json
      }

      // أرقام النخبة
      const eliteNumbers = [
        "𝟏", "𝟐", "𝟑", "𝟒", "𝟓", 
        "𝟔", "𝟕", "𝟖", "𝟗", "𝟏𝟎",
        "𝟏𝟏", "𝟏𝟐", "𝟏𝟑", "𝟏𝟒", "𝟏𝟓"
      ];

      // إنشاء الإطار
      const createBanner = () => {
        const border = '━'.repeat(35);
        const space = ' '.repeat(10);
        
        let banner = `╭${border}╮\n`;
        
        // السطر الأول: النجوم والزينة
        banner += `│${space}✨ ${'⭐'.repeat(5)} ✨${space}│\n`;
        
        // السطر الثاني: العنوان الرئيسي
        banner += `│${space}🦁 *مملكة يوميلا* 👑${space}│\n`;
        
        // السطر الثالث: خط فاصل
        banner += `│${'─'.repeat(37)}│\n`;
        
        // سطر أرقام النخبة
        const eliteLine = eliteNumbers.slice(0, 5).join('   ');
        banner += `│  🎖️ *أرقام النخبة:* ${eliteLine}  │\n`;
        
        // سطر أرقام النخبة الثانية
        const eliteLine2 = eliteNumbers.slice(5, 10).join('  ');
        banner += `│     ${eliteLine2}     │\n`;
        
        // سطر أرقام النخبة الثالثة
        const eliteLine3 = eliteNumbers.slice(10, 15).join(' ');
        banner += `│        ${eliteLine3}        │\n`;
        
        // خط فاصل
        banner += `│${'─'.repeat(37)}│\n`;
        
        // معلومات إضافية
        banner += `│   📅 تاريخ التأسيس: ٢٠٢٤        │\n`;
        banner += `│   🏰 عاصمة المملكة: قلعة الظل   │\n`;
        banner += `│   👑 الملك: مـــجـــهـــول العظيم         │\n`;
        
        // خط فاصل
        banner += `│${'─'.repeat(37)}│\n`;
        
        // شعار المملكة
        banner += `│${space}⚔️  🛡️  👑  ⚔️${space}│\n`;
        
        // التوقيع
        banner += `│${space}♜مـــجـــهـــول 𝑩𝒐𝒕꧂${space}│\n`;
        
        // نهاية الإطار
        banner += `╰${border}╯`;
        
        return banner;
      };

      // إنشاء نسخة مصغرة للإطار الثاني
      const createMiniBanner = () => {
        const miniBorder = '═'.repeat(30);
        
        let miniBanner = `✧･ﾟ: *✧･ﾟ:* ${miniBorder} *:･ﾟ✧*:･ﾟ✧\n\n`;
        
        // العنوان
        miniBanner += `         🏰 *مملكة يوميلا* 🏰\n\n`;
        
        // شعار النخبة
        miniBanner += `          🎖️ *النخبة المختارة* 🎖️\n`;
        
        // أرقام النخبة في مربعات
        const boxes = eliteNumbers.map(num => `【${num}】`).join(' ');
        miniBanner += `     ${boxes}\n\n`;
        
        // رمزية المملكة
        miniBanner += `        ⚜️  👑  ⚔️  🛡️  ⚜️\n\n`;
        
        // معلومات سريعة
        miniBanner += `✨ *مميزات المملكة:*\n`;
        miniBanner += `• الحماية القصوى 🛡️\n`;
        miniBanner += `• السرية التامة 🤫\n`;
        miniBanner += `• القوة الخارقة 💪\n\n`;
        
        // التوقيع
        miniBanner += `         ♜مـــجـــهـــول 𝑩𝒐𝒕꧂\n`;
        miniBanner += `✧･ﾟ: *✧･ﾟ:* ${miniBorder} *:･ﾟ✧*:･ﾟ✧`;
        
        return miniBanner;
      };

      // إنشاء نسخة ثالثة بتصميم مختلف
      const createModernBanner = () => {
        const modernBorder = '◈'.repeat(20);
        
        let modernBanner = `\n${modernBorder}\n\n`;
        modernBanner += `        ╔════════════════╗\n`;
        modernBanner += `        ║   🏛️  مملكة  🏛️   ║\n`;
        modernBanner += `        ║     شـــادو      ║\n`;
        modernBanner += `        ╚════════════════╝\n\n`;
        
        modernBanner += `𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀\n\n`;
        
        // أرقام النخبة بطريقة حديثة
        modernBanner += `◈ *كود النخبة:* ◈\n`;
        for (let i = 0; i < eliteNumbers.length; i += 3) {
          const line = eliteNumbers.slice(i, i + 3)
            .map(num => `【 ${num} 】`)
            .join('   ');
          modernBanner += `      ${line}\n`;
        }
        
        modernBanner += `\n𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀𓂀\n\n`;
        
        modernBanner += `◈ *معلومات سرية:* ◈\n`;
        modernBanner += `• المستوى: SSS 🏆\n`;
        modernBanner += `• القوة: 9999/10000 ⚡\n`;
        modernBanner += `• النخبة: ${eliteNumbers.length} عضو 👥\n\n`;
        
        modernBanner += `        ═══ ∘◦ ♜𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ ◦∘ ═══\n`;
        modernBanner += `\n${modernBorder}`;
        
        return modernBanner;
      };

      // إرسال الإطارات الثلاثة
      const banner1 = createBanner();
      const banner2 = createMiniBanner();
      const banner3 = createModernBanner();

      // إرسال الإطار الأول
      await sock.sendMessage(msg.key.remoteJid, {
        text: banner1
      }, { quoted: msg });

      // انتظار قليل ثم إرسال الثاني
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: banner2
      });

      // انتظار قليل ثم إرسال الثالث
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: banner3
      });

      // إرسال رسالة نهائية
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: `✨ *تم إنشاء إطار مملكة يوميلا بنجاح!*\n\n` +
              `🎖️ *معلومات النخبة:*\n` +
              `• عدد أفراد النخبة: ${eliteNumbers.length} فرد\n` +
              `• مستوى السرية: قصوى 🔒\n` +
              `• حالة المملكة: نشطة وفعالة ✅\n\n` +
              `🏰 *للدخول إلى المملكة:*\n` +
              `استخدم كود النخبة الخاص بك!`
      });

    } catch (error) {
      console.error('❌ خطأ في أمر مملكتي:', error);
      
      // إرسال إطار بسيط في حالة الخطأ
      const errorBanner = 
        `╔══════════════════════╗\n` +
        `║      🏰 مملكة مـــجـــهـــول 🏰     ║\n` +
        `║   النخبة: 𝟏 𝟐 𝟑 𝟒 𝟓   ║\n` +
        `║     𝟔 𝟕 𝟖 𝟗 𝟏𝟎     ║\n` +
        `║    ♜مـــجـــهـــول 𝑩𝒐𝒕꧂    ║\n` +
        `╚══════════════════════╝\n\n` +
        `❌ حدث خطأ في إنشاء الإطار الكامل`;
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: errorBanner
      }, { quoted: msg });
    }
  }
};