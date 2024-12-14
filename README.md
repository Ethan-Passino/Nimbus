# ☁️ Nimbus Bot

Nimbus is a powerful and customizable Discord bot designed to enhance your server's experience with utility commands, fun features, and robust server management tools.

---

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

### **Utility Commands**
- `/help`: Displays a list of all commands and their descriptions.
- `/say`: Makes the bot echo your message.
- `/setlogchannel`: Allows admins to set a specific log channel for the server. Requires administrator permissions.
- `/configurelogs`: Enables or disables specific logging events. Requires administrator permissions.
- `/define`: Looks up the definition of a word with support for multiple definitions and examples.
- `/serverinfo`: Displays detailed information about the current server.
- `/whois`: Provides detailed information about a server member, including join date, roles, and profile details.
- `/export`: Exports server analytics data to a CSV file (if analytics is enabled).
- `/analytics`: Displays server analytics data, including total messages, most active channels, and member statistics.

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

---

## 🚀 Future Enhancements

Here’s what’s coming next to Nimbus:

1. **Color Roles System**:
   - Allows users to create and select custom role colors using commands.

2. **Advanced Leveling, Moderation, Color Role System, and Analytics**
   - Make these systems more complex to have more features.

---

## 🎵 Optional Features Under Consideration

- **Music System**:
  - Play your favorite songs through Nimbus in a voice channel.
  - Manage playlists and queues with ease.
  - This may not be added depending on how complicated it would be to do and how it works with getting the music.

---

## 💡 Have Ideas?

Got suggestions or feature requests? Feel free to share your thoughts and help shape Nimbus into the ultimate Discord bot!

---

## 🛠️ Developer Notes

Nimbus is actively maintained and regularly updated to bring new features and improvements. The bot uses modern design principles and dynamic loading systems for commands and events, making it flexible and scalable.
