const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const mysql = require('mysql2');

const config = require('./config.json');

const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMembers
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ]
});

module.exports = client;

client.commands = new Collection();

const con = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: config.mysql.port
})

client.on('ready', async () => {

    require("./handler")(client, con);

    const readyEvent = require('./events/client/ready.js');
    await readyEvent.execute(client);

})

client.login(config.token)