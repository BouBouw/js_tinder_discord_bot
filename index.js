const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { join } = require('node:path')
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


client.commands = new Collection();

const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: config.mysql.port
})

client.on('ready', async () => {
    const { Handler } = await require('./handler');
    const { execute } = await require(join(process.cwd(), 'events', 'client', 'ready.js'));

    const handler = new Handler(client, connection);

    const commands = await handler.loadCommands();
    client.application.commands.set(commands.flat());

    await handler.loadEvents();

    const { load } = await require('./dashboard/index');
    load(client, connection);
    // await handler.createWebServer();

    await execute(client);
})

client.login(config.token)

module.exports = client;