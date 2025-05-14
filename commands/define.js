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
            const fetch = (await import('node-fetch')).default;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Word not found.');

            const data = await response.json();
            const entry = data[0];

            if (!entry?.meanings?.length) {
                return interaction.reply({
                    content: `No definitions found for **${word}**.`,
                    ephemeral: true,
                });
            }

            const definitions = entry.meanings.flatMap(meaning =>
                meaning.definitions.map(def => ({
                    partOfSpeech: meaning.partOfSpeech || 'Unknown',
                    definition: def.definition || 'No definition available.',
                    example: def.example || null,
                }))
            );

            const pronunciationAudio = entry.phonetics.find(p => p.audio)?.audio || null;

            let pageIndex = 0;

            const createEmbed = (index) => {
                const def = definitions[index];
                const embed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle(`📖 Definition of **${word}**`)
                    .setDescription(`**${index + 1} of ${definitions.length}**`)
                    .addFields(
                        { name: '🗂 Part of Speech', value: `*${def.partOfSpeech}*`, inline: true },
                        { name: '📝 Definition', value: def.definition }
                    )
                    .setFooter({ text: 'Powered by DictionaryAPI.dev' })
                    .setTimestamp();

                if (def.example) {
                    embed.addFields({ name: '💬 Example', value: `_"${def.example}"_` });
                }

                if (pronunciationAudio) {
                    embed.addFields({ name: '🔊 Pronunciation', value: `[Listen here](${pronunciationAudio})` });
                }

                return embed;
            };

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(definitions.length === 1)
            );

            const message = await interaction.reply({
                embeds: [createEmbed(pageIndex)],
                components: [buttons],
                fetchReply: true,
            });

            const collector = message.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 60000,
            });

            collector.on('collect', (i) => {
                if (i.customId === 'prev') pageIndex = Math.max(0, pageIndex - 1);
                else if (i.customId === 'next') pageIndex = Math.min(definitions.length - 1, pageIndex + 1);

                i.update({
                    embeds: [createEmbed(pageIndex)],
                    components: [
                        new ActionRowBuilder().addComponents(
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
                        )
                    ]
                });
            });

            collector.on('end', () => {
                message.edit({
                    components: [
                        new ActionRowBuilder().addComponents(
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
                        )
                    ]
                });
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `❌ I couldn't find the definition for **${word}**. Make sure the word is spelled correctly.`,
                ephemeral: true,
            });
        }
    },
};
