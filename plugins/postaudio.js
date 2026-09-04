const {
  downloadMediaMessage
} = require("@whiskeysockets/baileys");

module.exports = {
  name: "postaudio",
  description: "Post an authorized audio file to a WhatsApp Channel",

  run: async (sock, msg, args) => {
    const channelJid = args[0];

    if (!channelJid || !channelJid.endsWith("@newsletter")) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Channel JID එක දෙන්න.\n\nExample:\n.postaudio 120363xxxxxxxx@newsletter"
      });
    }

    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted?.audioMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Audio message එකක් reply කරලා .postaudio <Channel JID> දාන්න."
      });
    }

    try {
      const buffer = await downloadMediaMessage(
        {
          key: msg.message.extendedTextMessage.contextInfo.stanzaId
            ? {
                remoteJid: msg.key.remoteJid,
                id: msg.message.extendedTextMessage.contextInfo.stanzaId,
              }
            : msg.key,
          message: quoted
        },
        "buffer",
        {},
        {
          logger: console
        }
      );

      await sock.sendMessage(channelJid, {
        audio: buffer,
        mimetype: quoted.audioMessage.mimetype || "audio/mpeg",
        ptt: false
      });

      await sock.sendMessage(msg.key.remoteJid, {
        text: "✅ Audio Channel එකට post කරන්න try කළා."
      });

    } catch (error) {
      console.error("PostAudio Error:", error);

      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Audio post failed."
      });
    }
  }
};
