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
                console.log(results[0]);
                interaction.followUp({
                    embeds: [{
                        color: Colors.Red,
                        title: `Profile de ${interaction.user.tag}`,
                        description: `Description Here.`,
                        fields: [
                            {
                                name: `👤 Genre :`,
                                value: `> ${results[0].gender === 'male' ? '**Homme**' : '**Femme**'}`,
                                inline: true
                            },
                            {
                                name: `Recherche`,
                                value: `x`,
                                inline: true
                            }
                        ]
                    }]
                })
            }
        }
    )
    }
}