const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input!')
    .setDescriptionLocalizations(
      { 'pt-BR': 'Responde igual ao seu input!' }
    )
    .addStringOption(
      option => option
        .setName('input')
        .setDescription('The input to echo back')
        .setDescriptionLocalizations(
          { 'pt-BR': 'O input que vai ser repetido' }
        )
        .setRequired(true))
    .addChannelOption(
      option => option
        .setName('channel')
        .setDescription('The channel to echo into')
        .setDescriptionLocalizations(
          { 'pt-BR': 'O canal que será enviado a mensagem' }
        )),
  async execute (interaction) {
    interaction.reply(interaction.options._hoistedOptions[0].value);
  }
}
