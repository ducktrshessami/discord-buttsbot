![buttsbot Avatar](./assets/images/avatar-small.png)

# buttsbot

> I'm Buttbot! I say butt!
> 
> I'll buttify roughly one in every 30 messages by replacing some of the syllables in the message with the word "butt". If the result is the same message or just "butt" I throw it out. The word used as well as the frequency and rate of buttification can be changed.
> 
> -buttsbot

A [Discord](https://discord.com/) bot based on the [Twitch bot of the same name](https://www.twitch.tv/buttsbot/about). Buttification is random, but roughly follows the set frequency and rate.

Powered by [discord.js](https://discord.js.org/#/), a [Node.js](https://nodejs.org/) module

Avatar by Julia Rolon

# Usage

## Invite to Your Server

### [Invite buttsbot](https://discord.com/api/oauth2/authorize?client_id=780539847764082768&permissions=3072&scope=bot)

buttsbot can be invited to your server with the above link.

## Install to Your Machine

Alternatively you can run your own version of buttsbot by cloning this repository and installing the required dependencies.

After installing [Node.js](https://nodejs.org/) and cloning this repository, run the following command in the package directory:

```
npm install
```

After filling out `./cfg/config.json` with the relevant information, you can just run the following command:

```
node .
```

###### Personally, I run an external script to automatically restart the program in case the bot disconnects.

### `./cfg/config.json`:

- `token`: String containing the bot token obtained from the [Discord Developer Portal](https://discord.com/developers/applications)
- `admin`: Array\<[Snowflake](https://discord.js.org/#/docs/main/stable/typedef/Snowflake)> containing the IDs of botmin users. User IDs can be obtained by right clicking users in Discord with developer mode on.
- `presence`: Object:
    - `minutes`: Number with the interval to loop presences at
    - `presences`: Array\<[PresenceData](https://discord.js.org/#/docs/main/stable/typedef/PresenceData)> containing presences to loop through randomly at the above interval
- `default`: Object:
    - `word`: String with the word to insert into messages
    - `freq`: Number with the frequency at which messages are buttified (roughly 1 message in `freq`)
    - `rate`: Number with the rate at which syllables are buttified in a buttified message (roughly 1 syllable in `rate`)
- `generateCmd`: Object:
    - `help`: Boolean that tells `discord-bot` to generate a help command when set to `true`
- `embedColor`: [ColorResolvable](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable) for the `@buttsbot help` command list embed color
- `ignoreList`: Array\<[Snowflake](https://discord.js.org/#/docs/main/stable/typedef/Snowflake)> containing the IDs of users that used `@buttsbot ignoreme`
