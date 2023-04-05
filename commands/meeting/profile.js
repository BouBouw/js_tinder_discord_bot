const { ButtonStyle } = require('discord.js')
const { ApplicationCommandType, Colors, ActionRowBuilder, ButtonBuilder } = require('discord.js')

module.exports = {
    name: 'profile',
    description: '(💡) Utils',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args, con) => {
    con.execute(
        'SELECT * FROM `profile` WHERE `userID` = ?', [interaction.member.id], function(err, results, fields) {
            if(results.length == 0) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('setup')
                            .setLabel("S'enregistrer")
                            .setEmoji('⚙️')
                            .setStyle(ButtonStyle.Secondary)
                    )
                interaction.followUp({
                    embeds: [{
                        color: Colors.Red,
                        title: `Profile de ${interaction.user.tag}`,
                        description: `Aucune données trouvées.`
                    }],
                    components: [ row ]
                }).then(async (msg) => {
                    let gender = '';
                    let research = '';


                    const filter = (i) => i.user.id === interaction.member.id;
                    await Buttons();

                    async function Buttons() {
                        let collected;
                        try {
                            collected = await msg.awaitMessageComponent({ filter: filter });
                        } catch(err) {
                            if(err.code === 'INTERACTION_COLLECTOR_ERROR') {
                                return msg.delete();
                            }
                        }

                        if(!collected.deffered) await collected.deferUpdate();

                        switch(collected.customId) {
                            case 'setup': {
                                const genderType = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('gender_male')
                                            .setLabel('Je suis un homme')
                                            .setEmoji('🚹')
                                            .setStyle(ButtonStyle.Secondary),
                                        new ButtonBuilder()
                                            .setCustomId('gender_women')
                                            .setLabel("Je suis une femme")
                                            .setEmoji('🚺')
                                            .setStyle(ButtonStyle.Secondary)
                                    )
                                msg.edit({
                                    embeds: [{
                                        color: Colors.Red,
                                        title: `Profile de ${interaction.user.tag}`,
                                        description: `> Création du profil...`,
                                        fields: [
                                            {
                                                name: `👤 Genre`,
                                                value: "> `[...]`",
                                                inline: true
                                            }
                                        ]
                                    }],
                                    components: [ genderType ]
                                })
                                break;
                            }
                        }
                    }
                })
            } else {
                // console.log(results[0]);

                let gender;
                let sexual_orientation;
                let looking_for;

                let location;

                switch(results[0].gender) {
                    case 'male': {
                        gender = 'Homme';
                        break;
                    }
                    
                    case 'female': {
                        gender = 'Femme';
                        break;
                    }
                }

                switch(results[0].sexual_orientation) {
                    case 'heterosexual': {
                        sexual_orientation = 'Heterosexuel';
                        break;
                    }

                    case 'homosexual': {
                        sexual_orientation = 'Homosexuel';
                        break;
                    }

                    case 'bisexual': {
                        sexual_orientation = 'Bisexuel';
                        break;
                    }
                }

                switch(results[0].looking_for) {
                    case 'friends': {
                        looking_for = 'Amitié';
                        break;
                    }

                    case 'relationship': {
                        looking_for = 'Amour';
                        break;
                    }

                    case 'sex': {
                        looking_for = 'Intime';
                        break;
                    }
                }

                location = JSON.parse(results[0].location);

                const formatDateFr = (date) => {
                    const formatter = new Intl.DateTimeFormat('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    });
                  
                    return formatter.format(date);
                  };

                interaction.followUp({
                    embeds: [{
                        color: Colors.Red,
                        title: `Profile de ${interaction.user.tag}`,
                        description: `**__Description :__**\n> ${results[0] === null ? `Aucune description` : `${results[0].bio}`}`,
                        fields: [
                            {
                                name: '\u200b',
                                value: '**__➜ Informations personnelles :__**',
                                inline: false,
                            },
                            {
                                name: "`🏷️` Prénom :",
                                value: `${results[0].first_name}`,
                                inline: false
                            },
                            {
                                name: "`🎂` Date de naissance :",
                                value: `${formatDateFr(results[0].birthday_date)}`,
                                inline: false
                            },
                            {
                                name: '\u200b',
                                value: '**__➜ Identité :__**',
                                inline: false,
                            },
                            {
                                name: "`👤` Genre :",
                                value: `${gender}`,
                                inline: false
                            },
                            {
                                name: "`🧭` Orientation :",
                                value: `${sexual_orientation}`,
                                inline: false
                            },
                            {
                                name: "`🔍` Recherche :",
                                value: `${looking_for}`,
                                inline: false
                            },
                            {
                                name: '\u200b',
                                value: '**__➜ Emplacement :__**',
                                inline: false,
                            },
                            {
                                name: "`📌` Localisation :",
                                value: `${location.city.name}, ${location.city.zip}, ${location.city.country}`,
                                inline: false
                            }
                        ]
                    }]
                })
            }
        }
    )
    }
}