const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getLeaderboard } = require('../utils/levelingUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the top users by XP on this server.'),
    async execute(interaction) {
        const { guild } = interaction;

        // Fetch leaderboard data for the guild
        const leaderboard = getLeaderboard(guild.id);

        // Check if there are any entries in the leaderboard
        if (!leaderboard || leaderboard.length === 0) {
            return interaction.reply({
                content: 'No leaderboard data available for this server.',
                ephemeral: true,
            });
        }

        // Pagination setup
        const itemsPerPage = 10; // Number of entries per page
        let currentPage = 0;

        // Guild icon URL
        const guildIconURL = guild.iconURL({ dynamic: true, size: 512 });

        // Function to generate the embed for the current page
        const generateEmbed = (page) => {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const leaderboardPage = leaderboard.slice(start, end);

            const description = leaderboardPage
                .map((entry, index) => {
                    const rank = start + index + 1;
                    const member = guild.members.cache.get(entry.userId);
                    const username = member?.user.username || 'Unknown User';
                    return `**#${rank}** - ${username} <@${entry.userId}>\nLevel: ${entry.level}, XP: ${entry.xp}`;
                })
                .join('\n\n');

            return new EmbedBuilder()
                .setColor('#FFD700') // Gold for leaderboard
                .setTitle(`${guild.name}'s Leaderboard`)
                .setDescription(description || 'No data on this page.')
                .setThumbnail(guildIconURL) // Set guild icon as the thumbnail
                .setFooter({ text: `Page ${page + 1} of ${Math.ceil(leaderboard.length / itemsPerPage)}` })
                .setTimestamp();
        };

        // Create initial embed
        const embed = generateEmbed(currentPage);

        // Create buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('◀️ Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('▶️ Next')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === Math.ceil(leaderboard.length / itemsPerPage) - 1)
            );

        // Send the initial embed with buttons
        const message = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true,
        });

        // Collector to handle button interactions
        const collector = message.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id, // Ensure only the command user can interact
            time: 60000, // 1 minute timeout
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'previous' && currentPage > 0) {
                currentPage--;
            } else if (i.customId === 'next' && currentPage < Math.ceil(leaderboard.length / itemsPerPage) - 1) {
                currentPage++;
            }

            // Update the embed and buttons
            await i.update({
                embeds: [generateEmbed(currentPage)],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('previous')
                                .setLabel('◀️ Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 0),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('▶️ Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === Math.ceil(leaderboard.length / itemsPerPage) - 1)
                        ),
                ],
            });
        });

        collector.on('end', async () => {
            // Disable buttons after the collector times out
            await message.edit({
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('previous')
                                .setLabel('◀️ Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('▶️ Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true)
                        ),
                ],
            });
        });
    },
};
