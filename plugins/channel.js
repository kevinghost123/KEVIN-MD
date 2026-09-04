module.exports = {
  name: "channel",

  run: async (sock, msg, args) => {
    const channelJid = args[0];

    if (!channelJid) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Channel JID එක දෙන්න.\n\nExample:\n.channel 120363xxxxxxxx@newsletter"
      });
    }

    if (!channelJid.endsWith("@newsletter")) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ මේක WhatsApp Channel JID එකක් නෙමෙයි."
      });
    }

    const text = args.slice(1).join(" ");

    if (!text) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Post කරන්න text එකක් දෙන්න."
      });
    }

    try {
      await sock.sendMessage(channelJid, {
        text: text
      });

      await sock.sendMessage(msg.key.remoteJid, {
        text: "✅ Channel post sent."
      });

    } catch (error) {
      console.error(error);

      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Channel post failed."
      });
    }
  }
};
