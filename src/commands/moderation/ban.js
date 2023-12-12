const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

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
    const checkPermissions = {
      'pt-BR': 'Você não tem as permissões necessárias para executar este comando!'
    }

    const checkUser = {
      'pt-BR': 'O usuário não existe!'
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ content: checkPermissions[interaction.locale] ?? 'You don\'t have necessary permissions to run this command!', ephemeral: true });
      return;
    }

    const user = interaction.options.getUser('target');

    console.log(interaction.member.guild.roles.highest);

    if (!user) {
      await interaction.reply({ content: checkUser[interaction.locale] ?? 'The user doesn\'t exist!', ephemeral: true });
      return;
    }

    const checkSameUser = {
      'pt-BR': 'Você não pode banir a si mesmo!'
    }

    if (user.id === interaction.user.id) {
      await interaction.reply({ content: checkSameUser[interaction.locale] ?? 'You can\t ban yourself!', ephemeral: true });
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
      .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`)
      .addFields(
        { name: usernameLocales[interaction.locale] ?? 'Username', value: user.username, inline: true },
        { name: idLocales[interaction.locale] ?? 'ID', value: user.id, inline: true },
        { name: reasonLocales[interaction.locale] ?? 'Reason', value: reason }
      )
      .setFooter({ text: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp` })

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
      console.log(e);
    }
  }
}
