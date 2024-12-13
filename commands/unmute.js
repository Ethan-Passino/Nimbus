const { SlashCommandBuilder } = require('discord.js');
const { savePunishment } = require('../utils/punishmentUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Remove a timeout from a member.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to unmute')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'User is not in the server.', ephemeral: true });
        }

        try {
            await member.timeout(null);
            await interaction.reply({ content: `${target.tag} has been unmuted.` });

            // Save punishment reversal (optional)
            savePunishment(interaction.guild.id, target.id, 'unmute', 'Timeout removed');
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to unmute the member.', ephemeral: true });
        }
    },
};
