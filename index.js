const Discord = require('discord.js');

const client = new Discord.Client();

const { token, prefix } = require('./config.json');

const { readdirSync } = require('fs');

const { join } = require('path');

const config = require('./config.json');
client.config = config;


client.commands= new Discord.Collection();
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}


client.on("error", console.error);

client.on('ready', () => {
    client.user.setActivity('**help for know all commands')
    console.clear();
    console.log(`Bot Online`);
    console.log("Bot Default Prefix is:", config.prefix)
    console.log("Logged in as:", client.user.tag)
});



client.on("message", async message => {
    if(message.author.bot) return;

    if(message.content.startsWith(prefix)) {
        const command = message.content
        .toLowerCase()
        .slice(prefix.length)
        .split(" ")[0];
        if(!client.commands.has(command)) return;
        try {
            message.delete();
            client.commands.get(command).run(client, message );

        } catch (error){
            console.error(error);
        }
    }
})

client.login(token);