const { SlashCommandBuilder } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const { savePunishment } = require('../utils/punishmentUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for banning the member')
                .setRequired(false)),
    async execute(interaction) {
        
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        // Ban Command: Requires "Ban Members" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'You do not have the `Ban Members` permission required to use this command.', ephemeral: true });
        }

        if (!member) {
            return interaction.reply({ content: 'User is not in the server.', ephemeral: true });
        }

        if (!member.bannable) {
            return interaction.reply({ content: 'I cannot ban this member.', ephemeral: true });
        }

        try {
            await member.ban({ reason });
            await interaction.reply({ content: `Banned ${target.tag} for: ${reason}` });

            // Save punishment
            savePunishment(interaction.guild.id, target.id, 'ban', reason);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to ban the member.', ephemeral: true });
        }
    },
};
