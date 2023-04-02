const { Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
	name: 'interactionCreate',
	once: false,
execute: async (interaction, client, con) => {
    if(!interaction.isButton()) return;

    await GenderType();
    await ResearchType();

    async function GenderType() {
        let genderType;

        switch(interaction.customId) {
            case 'gender_male': {
                genderType = 'Homme';

                con.query(`INSERT INTO profile (userID, gender) VALUES ('${interaction.member.id}', 'male')`, function(err, result) {
                    if(err) throw err;
                    console.log(`[ Profile > User ] Updated !`);
                })

                const researchType = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('research_male')
                            .setLabel("Je recherche un homme")
                            .setEmoji('🚹')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('research_female')
                            .setLabel("Je recherche une femme")
                            .setEmoji('🚺')
                            .setStyle(ButtonStyle.Secondary)
                    )

                interaction.message.edit({
                    embeds: [{
                        color: Colors.Red,
                        title: `Profile de ${interaction.user.tag}`,
                        description: `> __Création du profil en cours...___`,
                        fields: [
                            {
                                name: `👤 Genre :`,
                                value: `> **${genderType}**`,
                                inline: true
                            },
                            {
                                name: `🔍 Recherche :`,
                                value: "> `[...]`",
                                inline: true
                            }
                        ]
                    }],
                    components: [ researchType ]
                })
                break;
            }
    
            case 'gender_female': {
                genderType = 'Femme';

                con.query(`INSERT INTO profile (userID, gender) VALUES ('${interaction.member.id}', 'female')`, function(err, result) {
                    console.log(`[ Profile > User ] Updated !`);
                })

                const researchType = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('research_male')
                            .setLabel("Je recherche un homme")
                            .setEmoji('🚹')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('research_female')
                            .setLabel("Je recherche une femme")
                            .setEmoji('🚺')
                            .setStyle(ButtonStyle.Secondary)
                    )

                interaction.message.edit({
                    embeds: [{
                        color: Colors.Red,
                        title: `Profile de ${interaction.user.tag}`,
                        description: `> __Création du profil en cours...___`,
                        fields: [
                            {
                                name: `👤 Genre :`,
                                value: `> **${genderType}**`,
                                inline: true
                            },
                            {
                                name: `🔍 Recherche :`,
                                value: "> `[...]`",
                                inline: true
                            }
                        ]
                    }],
                    components: [ researchType ]
                })
                break;
            }
        }
    };

    async function ResearchType() {
        let researchType;

        switch(interaction.customId) {
            case 'research_male': {
                researchType = 'Homme';

                break;
            }

            case 'research_female': {
                researchType = 'Homme';

                break;
            }
        }
    }

    }
}