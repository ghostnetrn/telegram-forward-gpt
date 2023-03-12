require("dotenv").config();
const fs = require("fs");
const { Api, TelegramClient } = require("telegram");
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
    const isChannel =
      update?.message?.peerId?.channelId &&
      channels.some((item) => item === channel);

    if (update?.message && isChannel) {
      const data = fs.readFileSync("messageInfos.json", "utf8");
      const messageInfos = JSON.parse(data);

      for (const messageInfo of messageInfos) {
        if (
          messageInfo.messageId === update.message.id &&
          messageInfo.channelId === channel
        ) {
          const msg = msgs.find((m) => m.id === messageInfo.sentMessageId);

          if (msg) {
            const mensagem = update.message.message;

            const options = {
              message: msg.id,
              text: mensagem,
              formattingEntities: update.message.entities,
            };

            await client.editMessage(`@${channelTarget}`, options);
          }

          // Sair do loop quando a condição for atendida
          break;
        }
      }
    }
  });

  // adds an event handler for new messages
  client.addEventHandler(eventPrint, new NewMessage({}));
})();

let messageInfos = [];

async function eventPrint(event) {
  const messageId = event.message?.id;
  let message = event.message?.message;
  let channelOrGroup = null;

  // if (isChannel) {
  //   // if Channel
    channelOrGroup = event?.message?.peerId?.channelId;
  // } else {
  //   // if Group
    channelOrGroup = event?.message?.peerId?.chatId;
  // }

  console.log(channelOrGroup)
  
  const channel = event?.message?.peerId?.channelId?.toString();
  const isChannel =
    event?.message?.peerId?.channelId &&
    channels.some((item) => item === channel);

  const options = {
    message: message,
    formattingEntities: event.message.entities,
    parseMode: "html",
  };

  if (isChannel && message) {
    const sentMessage = await client.sendMessage(`@${channelTarget}`, options);
    const messageInfo = {
      messageId: messageId,
      channelId: channel,
      sentMessageId: sentMessage.id,
    };

    messageInfos.push(messageInfo); // Adiciona o objeto `messageInfo` ao array `messageInfos`

    // Salva o array `messageInfos` em um arquivo JSON
    const jsonData = JSON.stringify(messageInfos);
    fs.writeFile("messageInfos.json", jsonData, "utf8", (err) => {
      if (err) {
        console.error(err);
      }
    });
    return;
  }

  if (isChannel && event.message.media) {
    await client.sendMessage(`@${channelTarget}`, {
      message,
      file: event.message?.media,
    });
  }
}
