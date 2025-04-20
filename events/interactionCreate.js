const { loadCustomCommands } = require('../utils/commandUtils');
const { isAuthorized } = require('../utils/permissionUtils');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command || !command.autocomplete) return;

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(`Error in autocomplete for command ${interaction.commandName}:`, error);
            }
        } else if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (command) {
                const allowed = isAuthorized(interaction.member, interaction.commandName);
                
                if(!allowed) {
                    return interaction.reply({
                        content: `🚫 You do not have permission to use \`/${interaction.commandName}\`.`,
                        ephemeral: true,
                    });
                }
                try {
                    await command.execute(interaction);
                } catch (error) {
                    console.error(`Error executing command ${interaction.commandName}:`, error);
                    await interaction.reply({
                        content: 'There was an error while executing this command!',
                        ephemeral: true,
                    });
                }
            } else {
                // Handle custom commands dynamically
                const customCommands = loadCustomCommands();
                const guildCommands = customCommands.guilds[interaction.guild.id] || {};
                const customCommandOutput = guildCommands[interaction.commandName];

                if (customCommandOutput) {
                    await interaction.reply(customCommandOutput);
                } else {
                    await interaction.reply({
                        content: 'Command not recognized.',
                        ephemeral: true,
                    });
                }
            }
        }
    },
};
