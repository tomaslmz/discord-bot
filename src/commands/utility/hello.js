const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('hello')
    .setNameLocalizations(
      { 'pt-BR': 'ola' }
    )
    .setDescription('Replies with Hello!')
    .setDescriptionLocalizations(
      { 'pt-BR': 'Responde com Olá!' }
    ),
  async execute (interaction) {
    const locales = {
      'pt-BR': 'Olá!'
    }

    interaction.reply(locales[interaction.locale] ?? 'Hello!');
  }
}
