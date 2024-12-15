const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides a list of commands or details about a specific command.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Get detailed info about a specific command')
                .setRequired(false)),
    async execute(interaction) {
        const commandName = interaction.options.getString('command');
        const commandsPath = path.resolve(__dirname); // Path to the commands folder
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        const commands = commandFiles.map(file => {
            const command = require(path.join(commandsPath, file));
            return {
                name: command.data.name,
                description: command.data.description,
            };
        });

        if (commandName) {
            // Show detailed help for a specific command
            const command = commands.find(cmd => cmd.name === commandName);
            if (command) {
                const embed = new EmbedBuilder()
                    .setTitle(`Help: /${command.name}`)
                    .setDescription(command.description)
                    .setColor(0x00AE86) // Choose a nice color
                    .setFooter({ text: 'Use /help to see all commands.' });

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                await interaction.reply({
                    content: `Command \`${commandName}\` not found.`,
                    ephemeral: true,
                });
            }
        } else {
            // General help with pagination
            const itemsPerPage = 10;
            const totalPages = Math.ceil(commands.length / itemsPerPage);
            let currentPage = 1;

            const generateEmbed = (page) => {
                const startIndex = (page - 1) * itemsPerPage;
                const currentCommands = commands.slice(startIndex, startIndex + itemsPerPage);

                const embed = new EmbedBuilder()
                    .setTitle('Available Commands')
                    .setDescription('Here are the commands you can use:')
                    .setColor(0x00AE86)
                    .setFooter({ text: `Page ${page} of ${totalPages}` });

                currentCommands.forEach(cmd => {
                    embed.addFields({ name: `/${cmd.name}`, value: cmd.description, inline: false });
                });

                return embed;
            };

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === 1),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === totalPages)
                );

            const message = await interaction.reply({
                embeds: [generateEmbed(currentPage)],
                components: [row],
                ephemeral: true,
                fetchReply: true,
            });

            const collector = message.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 60000, // Timeout after 1 minute
            });

            collector.on('collect', async (i) => {
                if (i.customId === 'prev') currentPage--;
                if (i.customId === 'next') currentPage++;

                await i.update({
                    embeds: [generateEmbed(currentPage)],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('prev')
                                    .setLabel('Previous')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(currentPage === 1),
                                new ButtonBuilder()
                                    .setCustomId('next')
                                    .setLabel('Next')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(currentPage === totalPages)
                            ),
                    ],
                });
            });

            collector.on('end', async () => {
                // Disable buttons after timeout
                await message.edit({
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
        }
    },
};
