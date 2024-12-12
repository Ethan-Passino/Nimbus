const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the JSON configuration file
const configPath = path.resolve(__dirname, '../data/logConfig.json');

// List of all supported logging events
const loggingEvents = [
    'messageDelete',
    'messageUpdate',
    'channelCreate',
    'channelDelete',
    'channelUpdate',
    'guildMemberAdd',
    'guildMemberRemove',
    'roleCreate',
    'roleDelete',
    'roleUpdate',
    'voiceStateUpdate',
    'inviteCreate',
    'inviteDelete',
    // Add more as needed
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configurelogs')
        .setDescription('Enable or disable specific logging events.')
        .addStringOption(option =>
            option
                .setName('event')
                .setDescription('The event to configure.')
                .setRequired(true)
                .addChoices(...loggingEvents.map(event => ({ name: event, value: event })))
        )
        .addStringOption(option =>
            option
                .setName('action')
                .setDescription('Enable or disable the event.')
                .setRequired(true)
                .addChoices(
                    { name: 'Enable', value: 'enable' },
                    { name: 'Disable', value: 'disable' }
                )
        ),
    async execute(interaction) {
        // Check if the user has Administrator permissions
        if (!interaction.member.permissions.has('Administrator')) {
            return await interaction.reply({
                content: 'You need Administrator permissions to use this command.',
                ephemeral: true,
            });
        }

        const event = interaction.options.getString('event');
        const action = interaction.options.getString('action');

        // Load existing configuration
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        }

        // Ensure the guild is in the configuration
        if (!config[interaction.guild.id]) {
            config[interaction.guild.id] = {};
        }

        // Update the event configuration
        config[interaction.guild.id][event] = action === 'enable';

        // Save the updated configuration
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        await interaction.reply({
            content: `The event \`${event}\` has been ${action === 'enable' ? 'enabled' : 'disabled'} for logging.`,
            ephemeral: true,
        });
    },
};
