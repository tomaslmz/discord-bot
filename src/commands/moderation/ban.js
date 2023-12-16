const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const defaultImage = require('../../functions/getDefaultImage');
const errorEmbed = require('../../embeds/error');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setNameLocalizations(
      { 'pt-BR': 'banir' }
    )
    .setDescription('Select a member and ban them.')
    .setDescriptionLocalizations(
      { 'pt-BR': 'Selecione um membro para banir.' }
    )
    .addUserOption(option =>
      option
        .setName('target')
        .setNameLocalizations(
          { 'pt-BR': 'alvo' }
        )
        .setDescription('The member to ban')
        .setDescriptionLocalizations(
          { 'pt-BR': 'O membro para banir' }
        )
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('reason')
        .setNameLocalizations(
          { 'pt-BR': 'motivo' }
        )
        .setDescription('The reason to ban')
        .setDescriptionLocalizations(
          { 'pt-BR': 'O motivo do banimento' }
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute (interaction) {
    const titleError = {
      'pt-BR': 'Um erro ocorreu ao banir'
    }

    if (!interaction.options.getMember('target').permissions.has(PermissionFlagsBits.KickMembers)) {
      const checkPermissions = {
        'pt-BR': 'Você não tem as permissões necessárias para executar este comando!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to ban', checkPermissions[interaction.locale] ?? 'You don\'t have necessary permissions to run this command!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const user = interaction.options.getUser('target');

    if (interaction.applicationId === user.id) {
      const banBot = {
        'pt-BR': 'Você não pode me banir!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to ban', banBot[interaction.locale] ?? 'You can\'t ban me!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!user) {
      const checkUser = {
        'pt-BR': 'O usuário não existe!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to ban', checkUser[interaction.locale] ?? 'The user doesn\'t exist!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      if (interaction.options.getMember('target').roles.highest.position > interaction.guild.members.cache.get(interaction.user.id).roles.highest.position) {
        const positionCheck = {
          'pt-BR': 'Você não tem permissão para banir este usuário!'
        }

        const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to ban', positionCheck[interaction.locale] ?? 'You don\'t have permission to ban this user!', interaction.user);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    } catch {
      const isOnServer = {
        'pt-BR': 'O membro que você está tentando banir não está no servidor!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to ban', isOnServer[interaction.locale] ?? 'The member you\'re trying to ban isn\'t in the server!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (user.id === interaction.user.id) {
      const checkSameUser = {
        'pt-BR': 'Você não pode banir a si mesmo!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to ban', checkSameUser[interaction.locale] ?? 'You can\'t ban yourself!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (user.id === interaction.member.guild.ownerId) {
      const banOwner = {
        'pt-BR': 'Você não pode banir o dono do servidor!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to ban', banOwner[interaction.locale] ?? 'You can\'t ban the server owner!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (interaction.options.getMember('target').roles.highest.position > interaction.guild.members.cache.get('1183611119785484339').roles.highest.position) {
      const noPermission = {
        'pt-BR': 'Não tenho permissão o suficiente para banir este usuário!'
      }

      const embed = errorEmbed(titleError[interaction.locale] ?? 'An error occured trying to ban', noPermission[interaction.locale] ?? 'I don\'t have sufficient permissions to ban that user!', interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const confirmButton = {
      'pt-BR': 'Confirmar banimento'
    }

    const confirm = new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel(confirmButton[interaction.locale] ?? 'Confirm ban')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = {
      'pt-BR': 'Cancelar banimento'
    }

    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel(cancelButton[interaction.locale] ?? 'Cancel ban')
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder()
      .addComponents(confirm, cancel);

    const titleConfirm = {
      'pt-BR': 'Confirmação de banimento'
    }

    const usernameLocales = {
      'pt-BR': 'Nome de usuário'
    }

    const idLocales = {
      'pt-BR': 'ID de usuário'
    }

    const reasonLocales = {
      'pt-BR': 'Motivo do banimento'
    }

    const reasonMessageLocales = {
      'pt-BR': 'Sem motivo'
    }

    const reason = interaction.options.getString('reason') ?? (reasonMessageLocales[interaction.locale] ?? 'No reason provided');

    const embed = new EmbedBuilder()
      .setColor('#d10d0d')
      .setTitle(titleConfirm[interaction.locale] ?? 'Ban confirmation')
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
            'pt-BR': 'Usuário banido!'
          }

          embed.setTitle(bannedMessage[interaction.locale] ?? 'User banned!');

          await interaction.guild.members.ban(user, { reason });
          await interaction.editReply({ embeds: [embed], components: [] });
          break;
        case 'cancel':
          const cancelled = {
            'pt-BR': 'Banimento cancelado'
          }

          embed.setTitle(cancelled[interaction.locale] ?? 'Cancelled ban');

          confirm.setDisabled(true);
          cancel.setDisabled(true);

          await interaction.editReply({ embeds: [embed], components: [] })
          break;
      }
    } catch (e) {
      const cancelled = {
        'pt-BR': 'Banimento cancelado'
      }

      embed.setTitle(cancelled[interaction.locale] ?? 'Cancelled ban');

      confirm.setDisabled(true);
      cancel.setDisabled(true);

      await interaction.editReply({ embeds: [embed], components: [row] });
    }
  }
}
