const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest')
const { readdirSync } = require('node:fs');
const { readFile, lstat } = require('node:fs/promises');
const colors = require('colors');
const { join } = require('node:path')

const config = require('../config.json')

class Handler {
    allowedExts = ['js']
    commands = []

    client
    connection

    constructor (client, connection) {
        this.client = client
        this.connection = connection
    }

    async connectDatabase (connection) {
        try {
            await connection.connect()
            console.log(`[SQL]`.bold.white + ` Databases has been connected!`.bold.green);
    
            this.connection = connection
        } catch (error) {
            throw new Error(error)
        }
    }

    async loadCommands (directory = 'commands') {
        return Promise.all(
            readdirSync(directory).flatMap(async (path) => {
                const location = join(directory, path)
                const stat = await lstat(location)
    
                // Allow recursive command directories
                if (stat.isDirectory()) {
                    return this.loadCommands(location)
                }

                // Exclude case of file is symlink
                if (stat.isFile() && this.fileHasValidExtension(location)) {
                    const command = await require(join(process.cwd(), location))
                    
                    this.client.commands.set(command.name, command)

                    console.log('[CMDS]'.bold.red + ' Loading commands :'.bold.white + ` ${command.name}`.bold.red);
                    return command
                }

            })
        )
    }

    async loadEvents (directory = 'events') {
        return Promise.all(
            readdirSync(directory).map(async (path) => {
                const location = join(directory, path)
                const stat = await lstat(location)
                
                // Allow recursive event directories
                if (stat.isDirectory()) {
                    await this.loadEvents(location)
                }
    
                // Exclude case of file is symlink
                if (stat.isFile() && this.fileHasValidExtension(location)) {
                    const { name, execute } = await require(join(process.cwd(), location))
                    
                    this.client.on(name, (...args) => execute(...args, this.client, this.connection))
                    console.log('[EVENTS]'.bold.red + ' Loading event :'.bold.white + ` ${name}`.bold.red);
                }
            })
        )
    }

    async createWebServer () {
        const load = await require(process.cwd(), 'dashboard', 'index.js');
        // console.log(load)
        // load(this.client, this.connection)
    }
    
    fileHasValidExtension (path) {
        const uri = path.split('.')
        return this.allowedExts.some((element) => element == uri[uri.length - 1])
    }

}

module.exports = {
    Handler
}

// module.exports = async (client, con) => {    
//     // Trying to connect Mysql2 Database
//     const connection = connectDatabase(con)

//     // slashCommands
//     const arrayOfSlashCommands = [];

//     const loadSlashCommands = (dir = "./commands/") => {
//         readdirSync(dir).forEach(dirs => {
//             const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

//             for (const files of commands) {
//                 const getFileName = require(`../${dir}/${dirs}/${files}`);
//                 client.commands.set(getFileName.name, getFileName);
//                 console.log(`[SLASH COMMANDS]`.bold.red + ` Loading command :`.bold.white + ` ${getFileName.name}`.bold.red);
//                 arrayOfSlashCommands.push(getFileName);
//             }
//         })

//         setTimeout(async () => {
//             console.log(`API >`.bold.white + ` Synchronize all commands with Discord API.`.bold.green)
//             await client.application.commands.set(arrayOfSlashCommands);
//         }, 5000)
//     }
//     loadSlashCommands();

//     console.log(`•----------•`.bold.black)

//     // # events
//     const loadEvents = (dir = "./events/") => {
//         readdirSync(dir).forEach(dirs => {
//             const events = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));
      
//             for(const files of events) {
//                 const getFileName = require(`../${dir}/${dirs}/${files}`)
//                 client.on(getFileName.name, (...args) => getFileName.execute(...args, client, con))
//                 console.log(`[EVENTS]`.bold.red + ` Loading event :`.bold.white + ` ${getFileName.name}`.bold.red);
//                 if(!events) return console.log(`[EVENTS]`.bold.red + `Nothing event in : `.bold.yellow + `${files}`.bold.red)
//             }
//         })
//     }
//     loadEvents();
//     console.log(`•----------•`.bold.black);

//     const loadWebServer = () => {
//         const { load } = require('../dashboard/index.js');
//         load(client, con)
//     }
//     loadWebServer();
//     console.log(`•----------•`.bold.black);
// }