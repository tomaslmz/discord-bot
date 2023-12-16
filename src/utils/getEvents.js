const path = require('path');
const fs = require('fs');

module.exports = async (client) => {
  const eventsPath = path.join(__dirname, '../', 'events');
  const eventsFile = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventsFile) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}
