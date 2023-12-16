require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');

const getCommands = require('./utils/getCommands');
const getEvents = require('./utils/getEvents');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent]
});

client.commands = new Collection();

client.cooldowns = new Collection();

(async () => {
  try {
    getCommands(client);
    getEvents(client);

    await mongoose.connect(process.env.db_url);

    console.log('Connected to DB');

    client.login(process.env.token);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
})();
