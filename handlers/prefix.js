const fs = require("fs");

module.exports = (client) => {
  console.log("Prefix Handler");

  fs.readdirSync("./commands/").forEach((dir) => {
    const commands = fs
      .readdirSync(`./commands/${dir}`)
      .filter((file) => file.endsWith(".js"));
    for (let file of commands) {
      let pull = require(`../commands/${dir}/${file}`);
      if (pull.config.name) {
        client.commands.set(pull.config.name, pull);
        console.log(
          `[HANDLER - PREFIX] Loaded a file: ${pull.config.name} (#${client.commands.size})`
        );
      } else {
        console.log(
          `[HANDLER - PREFIX] Couldn't load the file ${file}, missing module name value.`
        );
        continue;
      }
    }
  });
};
