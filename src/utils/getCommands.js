const path = require('path');
const fs = require('fs');

module.exports = async (client) => {
  const foldersPath = path.join(__dirname, '../', 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFile = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFile) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }
}
