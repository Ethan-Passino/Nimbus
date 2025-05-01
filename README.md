# ☁️ Nimbus-Bot

Nimbus is a powerful and customizable Discord bot designed to enhance your server's experience with utility commands, fun features, and robust server management tools.

## 🌟 Features

### **Moderation Commands**
- `/warn`: Issues a warning to a user and records it in the punishment log.
- `/kick`: Kicks a user from the server with an optional reason.
- `/ban`: Bans a user from the server with an optional reason.
- `/unmute`: Removes a timeout from a user.
- `/mute`: Temporarily times out a user with a specified duration and reason.
- `/clear`: Deletes messages in a channel, optionally filtering by a specific user.
- `/history`: Retrieves the punishment history of a specific user in the server.
- `/lockdown`: Prevents members from sending messages in a channel.
- `/unlock`: Restores message permissions in a previously locked channel.

### **Custom Commands**
- `/createCommand`: Allows server admins to create custom slash commands specific to their server.
- `/deleteCommand`: Allows server admins to delete previously created custom commands.

### **Color Roles System**
- `/createcolor [name] [hex]`: Creates a custom color role with a specific name and hex color (Admin only).
- `/assigncolor [name]`: Assigns a color role to yourself or removes all color roles by selecting "None."
- `/removecolor [name]`: Removes a specific color from the server's list and deletes its role (Admin only).
- `/setassigncolorrole [role]`: **DEPRECATED see setcommandroles** Sets a required role for using `/assigncolor` or allows everyone if no role is set (Admin only). 
- Fully integrated with autocomplete for selecting colors dynamically. 
- Customizable per server with stored settings and roles.

### **Utility Commands**
- `/help`: Displays a list of all commands and their descriptions. (may be removed later)
- `/say`: Makes the bot echo your message.
- `/setlogchannel`: Allows admins to set a specific log channel for the server. Requires administrator permissions.
- `/configurelogs`: Enables or disables specific logging events. Requires administrator permissions.
- `/define`: Looks up the definition of a word with support for multiple definitions and examples.
- `/serverinfo`: Displays detailed information about the current server.
- `/whois`: Provides detailed information about a server member, including join date, roles, and profile details.
- `/export`: Exports server analytics data to a CSV file (if analytics is enabled).
- `/analytics`: Displays server analytics data, including total messages, most active channels, and member statistics.
- `/setcommandroles`: Allows you to set what role can use what command in your specific guild.

### **Music Commands**
- `/play [URL or search term]`: Plays a song in the voice channel you’re connected to. Supports YouTube, Spotify, and more.
- `/pause`: Pauses the currently playing song.
- `/resume`: Resumes the paused song.
- `/stop`: Stops the music and clears the queue.
- `/queue`: Displays the current song queue.
- `/skip`: Skips to the next song in the queue.

### **Customizable Events**
- Logs server activity, including:
  - Message deletion and edits.
  - Channel creation, updates, and deletion.
  - Member joins, leaves, and role updates.
  - Voice state changes (join, leave, and switch).
  - Invite creation and deletion.
- Logging events can be enabled or disabled per server for full customization.

### **Leveling System**
- Tracks user activity and awards XP.
- Level-ups occur automatically when users reach the required XP threshold.
- Includes a per-server leaderboard with the top users based on level and XP.
- Dynamically adjusts XP requirements for each level.
- Role rewards for reaching specific levels.
- Fully customizable progress bars for tracking XP.

### **Analytics System**
- Tracks server activity, including:
  - Total messages sent.
  - Most active channels.
  - Member joins and leaves.
- Data can be exported as a CSV file for external analysis.
- Analytics tracking can be enabled or disabled per server.

---

## 🛠️ Built With

- **[Discord.js](https://discord.js.org/)**: A modern library for interacting with the Discord API.
- **Node.js**: The runtime powering the bot's backend functionality.

---

## 🤝 Invite Nimbus to Your Server

You can invite Nimbus to your server using the link below:

[Invite Nimbus](https://discord.com/oauth2/authorize?client_id=1316495186343231611&permissions=8&integration_type=0&scope=applications.commands+bot) 

This is not the most up to date version.

---

## 🚀 Future Enhancements

Here’s what’s coming next to Nimbus:

1. **Advanced Features for All Systems**:
   - Improve functionality and add more depth to Moderation, Custom Commands, Color Roles, Utility, Music, Customizable Events, Leveling, and Analytics. Some of them are not very fleshed out yet, but I am hoping to flesh some of them out more!

2. **Permissions Management**:
   - Add default permissions and test permission management.

3. **Enhanced Music Experience**:
   - Introduce playlist support, song looping, volume control, and more advanced features.

4. **Customization**:
   - Allow users to customize per guild bot settings.

---

## 🛠️ Developer Notes

Nimbus is actively maintained and regularly updated to bring new features and improvements. The bot uses modern design principles and dynamic loading systems for commands and events, making it flexible and scalable.
