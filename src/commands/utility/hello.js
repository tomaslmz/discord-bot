const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName('hello').setDescription('Replies with Hello!'),
  async execute (interaction) {
    const locales = {
      'pt-BR': 'Olá!'
    }

    interaction.reply(locales[interaction.locale] ?? 'Hello!');
    console.log(interaction.locale);
  }
}
