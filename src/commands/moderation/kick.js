const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const defaultImage = require('../../utils/getDefaultImage');
const errorEmbed = require('../../embeds/error');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setNameLocalizations(
      { 'pt-BR': 'expulsar' }
    )
    .setDescription('Select a member and kick them.')
    .setDescriptionLocalizations(
      { 'pt-BR': 'Selecione um membro para expulsar' }
    )
    .addUserOption(option =>
      option
        .setName('target')
        .setNameLocalizations(
          { 'pt-BR': 'alvo' }
        )
        .setDescription('The member to kick')
        .setDescriptionLocalizations(
          { 'pt-BR': 'O membro a ser expulsado' }
        )
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('reason')
        .setNameLocalizations(
          { 'pt-BR': 'motivo' }
        )
        .setDescription('The reason to kick')
        .setDescriptionLocalizations(
          { 'pt-BR': 'O motivo para ser expulso' }
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute (interaction) {
    const titleError = {
      'pt-BR': 'Ocorreu um erro ao expulsar'
    }

    if (!interaction.guild.members.cache.get(interaction.user.id).permissions.has(PermissionFlagsBits.KickMembers)) {
      const checkPermissions = {
        'pt-BR': 'Você não tem as permissões necessárias para executar este comando!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to kick', checkPermissions[interaction.locale] ?? 'You don\'t have necessary permissions to run this command!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const user = interaction.options.getUser('target');

    if (interaction.applicationId === user.id) {
      const banBot = {
        'pt-BR': 'Você não pode me expulsar!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to kick', banBot[interaction.locale] ?? 'You can\'t kick me!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!user) {
      const checkUser = {
        'pt-BR': 'O usuário não existe!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to kick', checkUser[interaction.locale] ?? 'The user doesn\'t exist!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      if (interaction.options.getMember('target').roles.highest.position > interaction.guild.members.cache.get(interaction.user.id).roles.highest.position) {
        const positionCheck = {
          'pt-BR': 'Você não tem permissão para expulsar este usuário!'
        }

        const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to kick', positionCheck[interaction.locale] ?? 'You don\'t have permission to kick this user!', interaction.user);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    } catch {
      const isOnServer = {
        'pt-BR': 'O membro que você está tentando expulsar não está no servidor!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to kick', isOnServer[interaction.locale] ?? 'The member you\'re trying to kick isn\'t in the server!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (user.id === interaction.user.id) {
      const checkSameUser = {
        'pt-BR': 'Você não pode expulsar a si mesmo!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to kick', checkSameUser[interaction.locale] ?? 'You can\'t kick yourself!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (user.id === interaction.member.guild.ownerId) {
      const banOwner = {
        'pt-BR': 'Você não pode expulsar o dono do servidor!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to kick', banOwner[interaction.locale] ?? 'You can\'t kick the server owner!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (interaction.options.getMember('target').roles.highest.position > interaction.guild.members.cache.get('1183611119785484339').roles.highest.position) {
      const noPermission = {
        'pt-BR': 'Não tenho permissão o suficiente para banir este usuário!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to kick', noPermission[interaction.locale] ?? 'I don\'t have sufficient permissions to kick that user!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const confirmButton = {
      'pt-BR': 'Confirmar expulsão'
    }

    const confirm = new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel(confirmButton[interaction.locale] ?? 'Confirm kick')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = {
      'pt-BR': 'Cancelar expulsão'
    }

    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel(cancelButton[interaction.locale] ?? 'Cancel kick')
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder()
      .addComponents(confirm, cancel);

    const titleConfirm = {
      'pt-BR': 'Confirmação de expulsão'
    }

    const usernameLocales = {
      'pt-BR': 'Nome de usuário'
    }

    const idLocales = {
      'pt-BR': 'ID de usuário'
    }

    const reasonLocales = {
      'pt-BR': 'Motivo da expulsão'
    }

    const reasonMessageLocales = {
      'pt-BR': 'Sem motivo'
    }

    const reason = interaction.options.getString('reason') ?? (reasonMessageLocales[interaction.locale] ?? 'No reason provided');

    const embed = new EmbedBuilder()
      .setColor('#d10d0d')
      .setTitle(titleConfirm[interaction.locale] ?? 'Kick confirmation')
      .setThumbnail(user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp` : `https://cdn.discordapp.com/embed/avatars/${defaultImage(user)}.png`)
      .addFields(
        { name: usernameLocales[interaction.locale] ?? 'Username', value: user.username, inline: true },
        { name: idLocales[interaction.locale] ?? 'ID', value: user.id, inline: true },
        { name: reasonLocales[interaction.locale] ?? 'Reason', value: reason }
      )
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatar ? `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp` : `https://cdn.discordapp.com/embed/avatars/${defaultImage(interaction.user)}.png` })

    const response = await interaction.reply({ embeds: [embed], components: [row] });

    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
      const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

      switch (confirmation.customId) {
        case 'confirm':
          const bannedMessage = {
            'pt-BR': 'Usuário expulso!'
          }

          embed.setTitle(bannedMessage[interaction.locale] ?? 'User kicked!');

          //   await interaction.guild.members.kick(user, { reason });
          await interaction.editReply({ embeds: [embed], components: [] });
          break;
        case 'cancel':
          const cancelled = {
            'pt-BR': 'Expulsão cancelada'
          }

          embed.setTitle(cancelled[interaction.locale] ?? 'Cancelled ban');

          confirm.setDisabled(true);
          cancel.setDisabled(true);

          await interaction.editReply({ embeds: [embed], components: [] })
          break;
      }
    } catch (e) {
      const cancelled = {
        'pt-BR': 'Expulsão cancelada'
      }

      embed.setTitle(cancelled[interaction.locale] ?? 'Cancelled kick');

      confirm.setDisabled(true);
      cancel.setDisabled(true);

      await interaction.editReply({ embeds: [embed], components: [row] });
    }
  }
}
