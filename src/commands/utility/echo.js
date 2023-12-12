const { SlashCommandBuilder, ChannelType } = require('discord.js');

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
        .setNameLocalizations(
          { 'pt-BR': 'canal' }
        )
        .setDescription('The channel to echo into')
        .setDescriptionLocalizations(
          { 'pt-BR': 'O canal que será enviado a mensagem' }
        ).addChannelTypes(ChannelType.GuildText)),
  async execute (interaction) {
    if (!interaction.options._hoistedOptions[1].value) {
      interaction.reply(interaction.options._hoistedOptions[0].value);
    } else {
      const locales = {
        'pt-BR': `A mensagem foi enviada no canal: <#${interaction.options._hoistedOptions[1].value}>.`
      }
      const channel = interaction.client.channels.cache.get(interaction.options._hoistedOptions[1].value);
      channel.send(interaction.options._hoistedOptions[0].value);
      interaction.reply({ content: locales[interaction.locale] ?? `The message was sent to the channel: <#${interaction.options._hoistedOptions[1].value}>.`, ephemeral: true })
    }
  }
}
