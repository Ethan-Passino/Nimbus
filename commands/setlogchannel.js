const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the JSON file
const logChannelsPath = path.resolve(__dirname, '../data/logChannels.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlogchannel')
        .setDescription('Set the log channel for this guild.')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('The channel to use for logging.')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the user has Administrator permissions
        if (!interaction.member.permissions.has('Administrator')) {
            return await interaction.reply({
                content: 'You do not have permission to use this command. Administrator permissions are required.',
                ephemeral: true,
            });
        }

        const channel = interaction.options.getChannel('channel');

        // Ensure the selected channel is a text channel
        if (channel.type !== 0) {
            return await interaction.reply({
                content: 'Please select a text channel.',
                ephemeral: true,
            });
        }

        // Load existing log channels
        let logChannels = {};
        if (fs.existsSync(logChannelsPath)) {
            logChannels = JSON.parse(fs.readFileSync(logChannelsPath, 'utf-8'));
        }

        // Update the log channel for this guild
        logChannels[interaction.guild.id] = channel.id;

        // Save to file
        fs.writeFileSync(logChannelsPath, JSON.stringify(logChannels, null, 4));

        await interaction.reply({
            content: `Log channel has been set to <#${channel.id}>.`,
            ephemeral: true,
        });
    },
};
