const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const { getGuildColors, saveGuildColors } = require('../utils/colorsUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removecolor')
        .setDescription('Remove a color from the guild’s list')
        .addStringOption(option =>
            option.setName('color')
                .setDescription('The name of the color to remove')
                .setRequired(true)
                .setAutocomplete(true)),
    async autocomplete(interaction) {
        const guildId = interaction.guild.id;
        const colors = getGuildColors(guildId);

        const choices = Object.keys(colors).map(color => ({
            name: color,
            value: color,
        }));

        await interaction.respond(choices.slice(0, 25)); // Discord limits to 25 choices
    },
    async execute(interaction) {
        // Check if the user has admin permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const colorName = interaction.options.getString('color').toLowerCase();
        const guildId = interaction.guild.id;
        const colors = getGuildColors(guildId);

        // Validate that the color exists
        if (!colors[colorName]) {
            return interaction.reply({ content: `No color named "${colorName}" exists.`, ephemeral: true });
        }

        try {
            // Remove the color from the JSON data
            delete colors[colorName];
            saveGuildColors(guildId, colors);

            // Optionally, delete the associated role
            const roleName = `color-${colorName}`;
            const role = interaction.guild.roles.cache.find(r => r.name === roleName);
            if (role) {
                await role.delete(`Color "${colorName}" was removed from the list.`);
            }

            return interaction.reply(`Color "${colorName}" has been removed from the guild's list.`);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'An error occurred while removing the color. Please try again.', ephemeral: true });
        }
    },
};
