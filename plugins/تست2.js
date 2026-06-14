const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'تست2',
  description: 'اختبار جاهزية البوت الملكي',
  usage: '.تست',
  category: 'tools',

  async execute(sock, msg) {
    try {
      const senderJid = msg.key.participant || msg.key.remoteJid;
      const botName = '❄ مـــجـــهـــول  𝑩𝒐𝒕꧂';
      const now = new Date();
      const date = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

      const response = `
╔⟪⟬╗
⟬❄⟭ اختبار جاهزية البوت الملكي
╚⟪⟬╝

┏━•⊰مـــجـــهـــول⊰𝑩𝑶𝑻⊱•━┓
『مـــجـــهـــول』
━━━━━━━━━━━━━━━━━━
*الحالة* : 〔Online & Dominating〕  
*الطاقة* : 〔MAXIMUM CORE ❄〕  
*الوضع* : 〔❄مـــجـــهـــول  Supreme Mode〕  
━━━━━━━━━━━━━━━━━━    
📥 *الأوامر* : تحت السيطرة الكاملة     
━━━━━━━━━━━━━━━━━━
_⚔️ 𝑽𝑰𝑷 𝑴𝑶𝑫𝑬 𓆩🔥𓆪_  
_أنا لا أعمل… أنا أُسيطر، أنا لا أستجيب… بل أُهيمن_  
━━━━━━━━━━━━━━━━━━
*❄ مـــجـــهـــول  𝑩𝒐𝒕꧂*  
┗━━•⊰ ❄ مـــجـــهـــول   - 𝑬𝑵𝑫 ⊱•━━┛
      `.trim();

      const imagePath = path.join(process.cwd(), 'resources/escanor5.jpg');
      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        await sock.sendMessage(msg.key.remoteJid, {
          image: imageBuffer,
          caption: response,
          mentions: [senderJid]
        }, { quoted: msg });
        return;
      }

      await sock.sendMessage(msg.key.remoteJid, {
        text: response,
        mentions: [senderJid]
      }, { quoted: msg });

    } catch (error) {
      const botName = '❄ مـــجـــهـــول  𝑩𝒐𝒕꧂';
      await sock.sendMessage(msg.key.remoteJid, {
        text: `🚫 حدث خطأ غير متوقع:\n${error.message || error.toString()}\n\n${botName}`,
        quoted: msg
      });
    }
  }
};