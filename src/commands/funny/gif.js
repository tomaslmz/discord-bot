const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gif')
    .setDescription('Sends a gif according to your choice!')
    .setDescriptionLocalizations({
      'pt-BR': 'Envia um gif de acordo com sua escolha!'
    })
    .addStringOption(
      option =>
        option
          .setName('category')
          .setNameLocalizations(
            { 'pt-BR': 'categoria' }
          )
          .setDescription('The gif category')
          .setDescriptionLocalizations(
            { 'pt-BR': 'A categoria do gif' }
          )
          .setRequired(true)
          .addChoices(
            { name: 'guiven', value: 'gif_guiven' },
            { name: 'breaking bad', value: 'gif_breaking_bad' }
          )
    ),

  async execute (interaction) {
    switch (interaction.options._hoistedOptions[0].value) {
      case 'gif_guiven':
        interaction.reply('https://tenor.com/view/guiven-gif-27651072');
        break;
      case 'gif_breaking_bad':
        interaction.reply('https://tenor.com/view/walter-white-gremio-jesse-pinkman-sasul-goodman-mike-gif-24917060');
        break;
    }
  }
}
