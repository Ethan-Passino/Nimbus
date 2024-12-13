const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Look up the definition of a word.')
        .addStringOption(option =>
            option.setName('word')
                .setDescription('The word to define')
                .setRequired(true)),
    async execute(interaction) {
        const word = interaction.options.getString('word');
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        try {
            const fetch = (await import('node-fetch')).default; // Dynamic import for node-fetch
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Word not found.');
            }

            const data = await response.json();
            const definitions = data[0]?.meanings.flatMap(meaning =>
                meaning.definitions.map(def => ({
                    partOfSpeech: meaning.partOfSpeech || 'Unknown',
                    definition: def.definition || 'No definition available.',
                    example: def.example || 'No example available.',
                }))
            );

            if (!definitions || definitions.length === 0) {
                return interaction.reply({
                    content: `No definitions found for **${word}**.`,
                    ephemeral: true,
                });
            }

            // Pagination variables
            let pageIndex = 0;

            // Function to create embed for the current page
            const createEmbed = (index) => {
                const def = definitions[index];
                return new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle(`Definition of ${word} (${index + 1}/${definitions.length})`)
                    .addFields(
                        { name: 'Part of Speech', value: def.partOfSpeech, inline: true },
                        { name: 'Definition', value: def.definition },
                        { name: 'Example', value: def.example }
                    )
                    .setFooter({ text: 'Powered by DictionaryAPI.dev' })
                    .setTimestamp();
            };

            // Buttons for navigation
            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true), // Disabled initially
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(definitions.length === 1) // Disabled if only one definition
                );

            const message = await interaction.reply({
                embeds: [createEmbed(pageIndex)],
                components: [buttons],
                fetchReply: true,
            });

            // Collector to handle button interactions
            const collector = message.createMessageComponentCollector({
                filter: (btnInteraction) => btnInteraction.user.id === interaction.user.id,
                time: 60000, // 60 seconds
            });

            collector.on('collect', (btnInteraction) => {
                if (btnInteraction.customId === 'prev') {
                    pageIndex = Math.max(0, pageIndex - 1);
                } else if (btnInteraction.customId === 'next') {
                    pageIndex = Math.min(definitions.length - 1, pageIndex + 1);
                }

                // Update embed and buttons
                btnInteraction.update({
                    embeds: [createEmbed(pageIndex)],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('prev')
                                    .setLabel('Previous')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(pageIndex === 0),
                                new ButtonBuilder()
                                    .setCustomId('next')
                                    .setLabel('Next')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(pageIndex === definitions.length - 1)
                            ),
                    ],
                });
            });

            collector.on('end', () => {
                // Disable buttons when the collector ends
                message.edit({
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('prev')
                                    .setLabel('Previous')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setCustomId('next')
                                    .setLabel('Next')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true)
                            ),
                    ],
                });
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `I couldn't find the definition for **${word}**.`,
                ephemeral: true,
            });
        }
    },
};
