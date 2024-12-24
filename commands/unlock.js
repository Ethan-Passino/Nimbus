const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock a channel to allow members to send messages.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to unlock (defaults to the current channel)')
                .setRequired(false)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        // Unlock Command: Requires "Manage Channels" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'You do not have the `Manage Channels` permission required to use this command.', ephemeral: true });
        }

        try {
            // Allow SEND_MESSAGES for @everyone
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                [PermissionsBitField.Flags.SendMessages]: null,
            });
            await interaction.reply({ content: `Unlocked ${channel.name}.` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to unlock the channel.', ephemeral: true });
        }
    },
};
