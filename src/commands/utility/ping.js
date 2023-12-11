const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .setDescriptionLocalizations({
      'pt-BR': 'Responde com Pong!'
    }),
  async execute (interaction) {
    await interaction.reply('Pong!');
  }
};
