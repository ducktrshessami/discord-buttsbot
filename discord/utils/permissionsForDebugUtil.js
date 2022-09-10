const { PermissionsBitField, ChannelType } = require("discord.js");

function permissionsForDebugutil(channel) {
    const actual = channel.permissionsFor(channel.guild?.members.me);
    if (!actual && process.env.DISCORD_OWNERID) {
        const clientMemberCached = !!channel.guild?.members.me;
        channel.client.users.send(process.env.DISCORD_OWNERID, `\\*\\*\\*\nPermissions For Client Received: ${actual?.toArray() ?? actual}\nChannel ID: ${channel.id}\nRaw Channel Type: ${ChannelType[channel.type]}\nChannel Class Name: ${channel.constructor.name}\nGuild ID: ${channel.guildId}\nGuild Availability: ${channel.guild?.available}\nClient Member Cached: ${clientMemberCached}\n\\*\\*\\*`)
            .catch(console.error);
    }
    return actual ?? channel.guild?.members.me?.permissions ?? new PermissionsBitField();
}

module.exports = permissionsForDebugutil;
