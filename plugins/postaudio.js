const {
  downloadMediaMessage
} = require("@whiskeysockets/baileys");

module.exports = {
  name: "postaudio",

  run: async (sock, msg, args) => {
    const channelJid = args[0];

    if (!channelJid || !channelJid.endsWith("@newsletter")) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Channel JID එක දෙන්න.\n\nExample:\n.postaudio 120363xxxxxxxx@newsletter"
      });
    }

    const contextInfo =
      msg.message?.extendedTextMessage?.contextInfo;

    const quotedMessage = contextInfo?.quotedMessage;

    if (!quotedMessage?.audioMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Audio message එකකට reply කරලා command එක දාන්න."
      });
    }

    try {
      const quotedKey = {
        remoteJid: msg.key.remoteJid,
        id: contextInfo.stanzaId,
        participant: contextInfo.participant
      };

      const audio = await downloadMediaMessage(
        {
          key: quotedKey,
          message: quotedMessage
        },
        "buffer",
        {}
      );

      await sock.sendMessage(channelJid, {
        audio,
        mimetype: quotedMessage.audioMessage.mimetype || "audio/mpeg",
        ptt: false
      });

      await sock.sendMessage(msg.key.remoteJid, {
        text: "✅ Audio එක Channel එකට post කරන්න try කළා."
      });

    } catch (error) {
      console.error("POSTAUDIO ERROR:", error);

      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Audio post failed."
      });
    }
  }
};
