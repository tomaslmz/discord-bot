const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const defaultImage = require('../../utils/getDefaultImage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Return with an user\'s or server\'s info!')
    .setDescriptionLocalizations({
      'pt-BR': 'Retorna com a informação de um usuário ou servidor!'
    })
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setNameLocalizations({
          'pt-BR': 'usuário'
        })
        .setDescription('Info about an user')
        .setDescriptionLocalizations({
          'pt-BR': 'Informação sobre o usuário'
        })
        .addUserOption(option =>
          option.setName('target')
            .setNameLocalizations({
              'pt-BR': 'alvo'
            })
            .setDescription('The user')
            .setDescriptionLocalizations({
              'pt-BR': 'O usuário'
            })))
    .addSubcommand(subcommand =>
      subcommand
        .setName('server')
        .setNameLocalizations({
          'pt-BR': 'servidor'
        })
        .setDescription('Info about the server')
        .setDescriptionLocalizations({
          'pt-BR': 'Informação sobre o servidor'
        })),

  async execute (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'user':
        const titleLocales = {
          'pt-BR': 'Informações do usuário'
        }

        const usernameLocales = {
          'pt-BR': 'Nome de usuário'
        }

        const idLocales = {
          'pt-BR': 'ID de usuário'
        }
        const user = interaction.options.getUser('target');

        if (user) {
          const embed = new EmbedBuilder()
            .setColor(0x009FF)
            .setTitle(titleLocales[interaction.locale] ?? 'User\'s info')
            .setThumbnail(user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp` : `https://cdn.discordapp.com/embed/avatars/${defaultImage(user)}.png`)
            .addFields(
              { name: usernameLocales[interaction.locale] ?? 'Username', value: user.username, inline: true },
              { name: idLocales[interaction.locale] ?? 'ID', value: user.id, inline: true }
            )
          await interaction.reply({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
            .setColor(0x009FF)
            .setTitle(titleLocales[interaction.locale] ?? 'User\'s info')
            .setThumbnail(interaction.user.avatar ? `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp` : `https://cdn.discordapp.com/embed/avatars/${defaultImage(interaction.user)}.png`)
            .addFields(
              { name: usernameLocales[interaction.locale] ?? 'Username', value: interaction.user.username, inline: true },
              { name: idLocales[interaction.locale] ?? 'ID', value: interaction.user.id, inline: true }
            )
          await interaction.reply({ embeds: [embed] });
        }
        break;
      case 'server':
        const titleServerLocales = {
          'pt-BR': 'Informações do servidor'
        }

        const nameLocales = {
          'pt-BR': 'Nome do servidor'
        }

        const totalLocales = {
          'pt-BR': 'Quantidade de membros'
        }

        const embed = new EmbedBuilder()
          .setColor(0x009FF)
          .setTitle(titleServerLocales[interaction.locale] ?? 'Server\'s info')
          .addFields(
            { name: nameLocales[interaction.locale] ?? 'Server\'s name', value: interaction.guild.name, inline: true },
            { name: totalLocales[interaction.locale] ?? 'Total members', value: interaction.guild.memberCount.toString(), inline: true }
          )

        if (interaction.guild.icon) {
          embed.setThumbnail(`https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.webp`)
        }

        await interaction.reply({ embeds: [embed] });
        break;
    }
  }
}
