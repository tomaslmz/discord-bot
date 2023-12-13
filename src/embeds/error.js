const { EmbedBuilder } = require('discord.js');

module.exports = (title, description, user) => {
  const embed = new EmbedBuilder()
    .setColor('#d10d0d')
    .setTitle(title)
    .setDescription(description)
    .setThumbnail('https://cdn-icons-png.flaticon.com/512/5067/5067704.png')

  return embed;
}
