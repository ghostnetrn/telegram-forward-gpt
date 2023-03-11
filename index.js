require("dotenv").config();
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input");

const apiId = parseInt(process.env.TELEGRAM_API_ID.trim());
const apiHash = process.env.TELEGRAM_API_HASH.trim();
const stringSession = new StringSession(process.env.STRING_SESSION.trim());
const channels = process.env.CHANNELS_SOURCE.split(",");
const channelTarget = process.env.CHANNEL_TARGET;

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

(async () => {
  console.log("Loading interactive example...");
  await client.start({
    phoneNumber: async () => await input.text("number ?"),
    password: async () => await input.text("password?"),
    phoneCode: async () => await input.text("Code ?"),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save());

  client.addEventHandler(async (update) => {
    const msgs = await client.getMessages(`@${channelTarget}`, {
      limit: 30,
    });

    const channel = update?.message?.peerId?.channelId?.toString();
    console.log(channel);
    const isChannel = channels.some((item) => item === channel);
    console.log(isChannel);

    if (update?.message && isChannel) {
      for (const msg of msgs) {
        if (msg.text.includes(update.message.id)) {
          let mensagem = `🎯id: ${update.message.id}\n`;
          mensagem += update.message.message;

          await client.editMessage(`@${channelTarget}`, {
            message: msg.id,
            text: mensagem,
          });

          // Sair do loop quando a condição for atendida
          break;
        }
      }
    }
  });

  // adds an event handler for new messages
  client.addEventHandler(eventPrint, new NewMessage({}));
})();

async function eventPrint(event) {
  let message = `🎯id: ${event.message.id}\n`;
  message += event.message.message;

  const channel = event?.message?.peerId?.channelId?.toString();
  const isChannel = channels.some((item) => item === channel);

  if (isChannel) {
    await client.sendMessage(`@${channelTarget}`, {
      message: `${message}`,
    });
  }
}
