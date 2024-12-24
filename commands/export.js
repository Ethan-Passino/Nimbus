const { SlashCommandBuilder } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const { loadAnalytics } = require('../utils/analyticsUtils');
const { isAnalyticsEnabled } = require('../utils/analyticsConfigUtils');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('export')
        .setDescription('Export analytics data as a CSV file.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;

        // Export Command: Requires "Administrator" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have the `Administrator` permission required to use this command.', ephemeral: true });
        }

        // Check if analytics is enabled for the guild
        if (!isAnalyticsEnabled(guildId)) {
            return interaction.reply({ content: 'Analytics tracking is disabled for this server.', ephemeral: true });
        }

        const analytics = loadAnalytics();
        const guildData = analytics.guilds[guildId];

        if (!guildData) {
            return interaction.reply({ content: 'No analytics data available for this server.', ephemeral: true });
        }

        // Prepare data for CSV
        const filePath = path.resolve(__dirname, `../exports/analytics-${guildId}.csv`);
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'type', title: 'Type' },
                { id: 'id', title: 'ID' },
                { id: 'name', title: 'Name' },
                { id: 'value', title: 'Value' },
            ],
        });

        const csvData = [];

        // Add message stats
        csvData.push({ type: 'Messages', id: 'total', name: 'Total Messages', value: guildData.messages.total });
        for (const [userId, count] of Object.entries(guildData.messages.byUser)) {
            csvData.push({ type: 'Messages', id: userId, name: 'User', value: count });
        }
        for (const [channelId, count] of Object.entries(guildData.messages.byChannel)) {
            csvData.push({ type: 'Messages', id: channelId, name: 'Channel', value: count });
        }

        // Add member stats
        csvData.push({ type: 'Members', id: 'joins', name: 'Joins', value: guildData.memberStats.joins });
        csvData.push({ type: 'Members', id: 'leaves', name: 'Leaves', value: guildData.memberStats.leaves });

        // Write to CSV
        try {
            await csvWriter.writeRecords(csvData);

            // Send the file
            await interaction.reply({
                content: 'Here is the exported analytics data:',
                files: [filePath],
            });

            // Clean up the file after sending
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to export analytics data.', ephemeral: true });
        }
    },
};
