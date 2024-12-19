const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const { getGuildColors, saveGuildColors } = require('../utils/colorsUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createcolor')
        .setDescription('Create a new color for this guild')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the color')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('hex')
                .setDescription('The hex code of the color (e.g., #FF5733)')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the user has admin permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const name = interaction.options.getString('name').toLowerCase();
        const hex = interaction.options.getString('hex');

        // Validate hex code format
        if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            return interaction.reply({ content: 'Invalid hex code format. Use #RRGGBB.', ephemeral: true });
        }

        const guildId = interaction.guild.id;
        const colors = getGuildColors(guildId);

        // Check if the color name already exists
        if (colors[name]) {
            return interaction.reply({ content: `A color named "${name}" already exists.`, ephemeral: true });
        }

        try {
            // Create the role in the guild with the specified color
            const role = await interaction.guild.roles.create({
                name: `color-${name}`,
                color: hex,
                reason: `Color role created for "${name}" with hex code "${hex}".`,
            });

            // Save the color to the guild's JSON file
            colors[name] = hex;
            saveGuildColors(guildId, colors);

            return interaction.reply(`Color "${name}" with hex code "${hex}" has been created and a role named "${role.name}" has been added to the server.`);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'An error occurred while creating the role. Please try again.', ephemeral: true });
        }
    },
};