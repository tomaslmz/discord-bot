const { Events } = require('discord.js');
const Level = require('../models/Level');
const User = require('../models/User');
const calculateXpLevel = require('../utils/calculateXpLevel');

const cooldowns = new Set();

function getRandomXp (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  name: Events.MessageCreate,
  async execute (message) {
    if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

    const xpToGive = getRandomXp(5, 15);

    const query = {
      userId: message.author.id,
      guildId: message.guildId
    }

    try {
      const user = await Level.findOne(query);

      if (user) {
        user.xp += xpToGive;

        if (user.xp > calculateXpLevel(user.level)) {
          user.xp = 0;
          user.level += 1;

          const localeUser = await User.findOne({ id: user.userId });

          const messageLocale = {
            'pt-BR': `${message.member}, você aumentou seu **nível** para **${user.level}**`
          }

          message.channel.send(messageLocale[localeUser.locale] ?? `${message.member} you have leveled up to **level ${user.level}**.`);
        }

        await user.save().catch((e) => {
          console.log(`Error saving updated level ${e}`);
        });

        cooldowns.add(message.author.id);
        setTimeout(() => {
          cooldowns.delete(message.author.id);
        }, 30000);
      } else {
        const newLevel = new Level({
          userId: message.author.id,
          guildId: message.guildId,
          xp: xpToGive
        });

        await newLevel.save();

        cooldowns.add(message.author.id);
        setTimeout(() => {
          cooldowns.delete(message.author.id);
        }, 30000);
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }
}
