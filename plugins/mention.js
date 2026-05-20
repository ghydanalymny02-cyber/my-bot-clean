module.exports = {
  command: 'mention',
  description: '🔔 منشن مخفي باسم مزخرف',
  category: 'tools',

  async execute(sock, msg, args = []) {
    try {
      const groupJid = msg.key.remoteJid;

      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, {
          text: '❌ هذا الأمر يعمل فقط في القروبات.'
        }, { quoted: msg });
      }

      // الرقم اللي هيتعمله منشن
      const mentionNumber = '201234567890'; // <-- ✨ غيّر الرقم ده لرقم الشخص المطلوب بدون "+" وبصيغة دولية

      const mentionJid = mentionNumber + '@s.whatsapp.net';

      await sock.sendMessage(groupJid, {
        text: 'دزو',
        mentions: [mentionJid]
      }, { quoted: msg });

    } catch (err) {
      return sock.sendMessage(groupJid, {
        text: `❌ حصل خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};oted: msg });
    }
  }
};