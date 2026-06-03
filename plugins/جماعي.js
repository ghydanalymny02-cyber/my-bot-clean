const { isElite } = require('../haykala/elite');

module.exports = {
  command: 'جماعي',
  category: 'الملك',
  description: 'منشن جماعي مفصل للنخبة فقط داخل المجموعات (يظهر المالك والمشرفين والأعضاء)',

  async execute(sock, msg, args = []) {
    try {
      const groupJid = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.participant || groupJid;

      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, {
          text: '🚫 هذا الأمر يعمل داخل المجموعات فقط.',
        }, { quoted: msg });
      }

      const senderNumber = senderJid.split('@')[0];
      if (!isElite(senderNumber)) {
        return sock.sendMessage(groupJid, {
          text: '❌ هذا الأمر مخصص فقط للنخبة.',
        }, { quoted: msg });
      }

      const metadata = await sock.groupMetadata(groupJid);
      const groupName = metadata.subject;
      const participants = metadata.participants;
      const memberCount = participants.length;
      const allIds = participants.map(p => p.id);

      let profilePicUrl;
      try {
        profilePicUrl = await sock.profilePictureUrl(groupJid, 'image');
      } catch {
        profilePicUrl = 'https://i.pinimg.com/736x/28/2b/e5/282be5ae28f1b520d253a2dfc4f2e57a.jpg';
      }

      let owner = metadata.owner ? `@${metadata.owner.split('@')[0]}` : 'غير معروف';
      let admins = [];
      let members = [];

      for (let p of participants) {
        const id = `@${p.id.split('@')[0]}`;
        if (p.admin === 'superadmin') {
          owner = id;
        } else if (p.admin === 'admin') {
          admins.push(`┃ ${admins.length + 1}.* ${id}`);
        } else {
          members.push(`┃ ${members.length + 1}.* ${id}`);
        }
      }

      const formattedText = `

┏┅ ━━━━━━━━━━━━━━━ ┅ ━┓
┃╻💬╹↵ ❮ منـشـن جـمـاعـي ❯ ↯
┃╻🔖╹↵ ❮ ${groupName} ❯
┃╻👥╹↵ ❮ عدد الأعضاء: ${memberCount} ❯
┏┅ ━━━━━━━━━━━━━━━ ┅ ━┓
┃╻👑╹↵ ❮ المالك ❯ ↯
┃╻🔖╹↵ ${owner}
┣┅ ━━━━━━━━━━━━━━━ ┅ ━┫
┃╻🕵🏻‍♂️╹↵ ❮ المشرفون ❯ ↯
${admins.join('\n') || '┃ لا يوجد مشرفون.'}
┣┅ ━━━━━━━━━━━━━━━ ┅ ━┫
┃╻👥╹↵ ❮ الأعضاء ❯ ↯
${members.join('\n') || '┃ لا يوجد أعضاء عاديون.'}
┗┅ ━━━━━━━━━━━━━━━ ┅ ━┛

> **`.trim();

      await sock.sendMessage(groupJid, {
        image: { url: profilePicUrl },
        caption: formattedText,
        mentions: allIds,
      }, { quoted: msg });

      await sock.sendMessage(groupJid, {
        react: { text: '⚡', key: msg.key },
      });

    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ حدث خطأ أثناء التنفيذ:\n${err.message || err.toString()}`,
      }, { quoted: msg });
    }
  }
};