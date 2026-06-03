const { eliteNumbers } = require('../haykala/elite');

module.exports = {
  command: 'اتحرش',
  description: 'ارسال رسائل ساخنه 🌹',
  category: 'ترفيه',
  async execute(sock, m) {
    try {
      const chatId = m.key.remoteJid;
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

      // الحصول على معلومات منشن أو رد
      const contextInfo = m.message?.extendedTextMessage?.contextInfo || {};
      const mentionedJids = contextInfo.mentionedJid || [];
      const repliedJid = contextInfo.participant || null;

      // تحديد الهدف
      let target = null;
      if (mentionedJids.length > 0) target = mentionedJids[0];
      else if (repliedJid) target = repliedJid;

      if (chatId.endsWith('@g.us')) {
        // في جروب

        if (!target) {
          await sock.sendMessage(chatId, {
            text: '❌ الرجاء منشن أو رد على شخص لتنفيذ الأمر.'
          }, { quoted: m });
          return;
        }

        if (
          target === botNumber ||
          eliteNumbers.includes(target) ||
          mentionedJids.includes(botNumber) ||
          repliedJid === botNumber
        ) {
          await sock.sendMessage(chatId, {
            text: '❌ لا يمكن تنفيذ الأمر على البوت أو النخبة.'
          }, { quoted: m });
          return;
        }

        const flirtQuotes = [
          "🫦 ‏على جسدها الفاتن قصص لا يحكيها سوى اللمس الساخن.",
          "🫦 موطني صدرك وليست هذه الأرض.",
          "🫦 كان يكفي أن تمسحي على شفتي بطرف سبابتك لكي لا يعذبني النطق.",
          "🫦 مد روحك وامد روحي وريدن بيك اتلفلف وحط شفتي ع شفتك لحد الريج ما ينشف.",
          "🫦 شفايفج بيهن طعم هيل وعطر صدرك أشمه واصيح الويل.",
          "🫦 تعالي وأقتربي مني وضعي أنوثتكِ وآثار جنونكِ على جسدي.",
          "🫦 شهوتي مش بتسكت غير لما تكون معايا بالكامل.",
          "🫦 كلهـا تهون لمن أوقع بحضنك.",
          "🫦 الـذنـب بشفايفك مـرغـوب ذب الثوب بس هاليله تالي أتوب.",
          "🫦 عانقني بدلاً من معانقة تفكيري كُل ليله.",
          "🫦 آفسِح ليّ فخذيك ، أود الخلودّ في موطني.",
          "🫦 هلّا تكرمت الأرضَ بمنحنا زاوية صغيرة لنتعانق؟..",
          "🫦 القُبلة لا تُستأذن بل تُرتكب.",
          "🫦 بعد شفتي حرام تبوس فدوه لشفتك الهيله.",
          "🫦 لحظة عناق كفيلة بأن تذيبني عشقا بين أحضانك.",
          "🫦 لا يوجد أجمل من مذاق جسدك.",
          "🫦 نفسي أنام على صدرك وأنسى الدنيا كلها.",
          "🫦 مين اللي ينيمه غيرك؟.",
          "🫦 أحبك للحَد الذي يجعلني لا أصلحُ لغيرك.",
          "🫦 إقتربي لأهمس لكِ أنني إشتقت لكِ ولأضع توقيع شفاهي.",
          "🫦 سلّمي جسدك لجحيمي و أرقصي.",
          "🫦 شفتاها تـَشدني للعنف رغم برائتي.",
          "🫦 عند ألتصاق أجسادنا لغة آه هي السائدة.",
          "🫦 استلذ بمرورتك ووحشيتكِ."
        ];

        const randomQuote = flirtQuotes[Math.floor(Math.random() * flirtQuotes.length)];
        const username = target.split('@')[0];
        const message = `🫦 @${username}, ${randomQuote}`;

        await sock.sendMessage(chatId, { text: message, mentions: [target] }, { quoted: m });

      } else {
        // في الخاص
        const flirtQuotes = [
          "🫦 ‏على جسدك الفاتن قصص لا يحكيها سوى اللمس الساخن.",
          "🫦 صدرك موطني وأنت أرضي.",
          "🫦 كان يكفي أن تمسح على شفتي بطرف سبابتك لكي لا أعذب نفسي بالكلام.",
          "🫦 مد روحك وامد روحي، وأريد أن أتلفلف وأضع شفتي على شفتيك حتى يجف الريح.",
          "🫦 شفايفك طعمها هيل وعطر صدرك أشمّه وأصيح بالويل.",
          "🫦 تعال وأقرب مني، وضع أنوثتك وآثار جنونك على جسدي.",
          "🫦 شهوتي لا تسكت إلا عندما تكون معي بالكامل.",
          "🫦 كل شيء يهون عندما أكون بين أحضانك."
        ];

        const randomQuote = flirtQuotes[Math.floor(Math.random() * flirtQuotes.length)];
        await sock.sendMessage(chatId, { text: `🫦 ${randomQuote}` }, { quoted: m });
      }

    } catch (error) {
      console.error('Error executing command تح:', error);
      // راسل المستخدم برسالة خطأ عند حدوث مشكلة (اختياري)
      if (m.key && m.key.remoteJid) {
        await sock.sendMessage(m.key.remoteJid, {
          text: '❌ حدث خطأ أثناء تنفيذ الأمر. حاول مرة أخرى.'
        }, { quoted: m });
      }
    }
  }
};