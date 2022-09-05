const {
  Client,
  Partials,
  Collection,
  GatewayIntentBits,
} = require("discord.js");
const config = require("./config/config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
  presence: {
    activities: [
      {
        name: "Hooh Tenan...",
        type: 1,
      },
    ],
    status: "idle",
  },
});

require("http")
  .createServer((req, res) => res.end("Ready!"))
  .listen(process.env.PORT || 8000);

const authToken = process.env.TOKEN || config.Client.TOKEN;
if (!authToken) {
  console.warn(
    "[CRASH] Authentication Token for Discord bot is required! Use Environment Secrets or config.json." +
      "\n"
  );
  return process.exit();
}

client.commands = new Collection();
client.slashcmds = new Collection();
client.events = new Collection();

module.exports = client;

["events", "mongoose", "prefix", "slash"].forEach((file) => {
  require(`./handlers/${file}`)(client);
});

client.login(authToken).catch((err) => {
  console.error(
    "[CRASH] Something went wrong while connecting to your bot..." + "\n"
  );
  console.error("[CRASH] Error from Discord API:" + err);
  process.exit();
});

process.on("unhandledRejection", async (err, promise) => {
  console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`);
  console.error(promise);
});
