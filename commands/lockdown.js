const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Lock a channel to prevent members from sending messages.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to lock (defaults to the current channel)')
                .setRequired(false)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        // Lockdown Command: Requires "Manage Channels" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'You do not have the `Manage Channels` permission required to use this command.', ephemeral: true });
        }

        try {
            // Deny SEND_MESSAGES for @everyone
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                [PermissionsBitField.Flags.SendMessages]: false,
            });
            await interaction.reply({ content: `Locked down ${channel.name}.` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to lock the channel.', ephemeral: true });
        }
    },
};
