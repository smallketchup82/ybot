# ybot
ybot is a bot that puts the letter "y" before every single word in the english dictionary.
Inspired by yname from the Galaxy Community
https://hub.docker.com/r/smallketchup/ybot
# Installation
Manual method

1. Clone the repository to your device. (Ubuntu OS recommended as I have only tested it on that OS)
2. Rename config.json.example to config.json and look below for configuration documentation
3. Open a terminal and go to the directory where you cloned the repository.
4. Run `npm install` while in the bot's directory
5. Start the bot with `node .`. We recommend using PM2 though, to start with PM2 run `pm2 start ecosystem.config.js`
6. Invite the bot to your discord server and give it necessary permissions.
7. Run y!start in any channel and watch the bot go. Refer to the commands section for more commands.  

Make sure to check this repository every so often for updates.

## Installing with docker-compose
Easiest method

1. Clone the repository
2. Edit config.json according to the documentation below
3. Run `docker-compose up -d` in the directory where you cloned the repo  

To restart the bot run `docker-compose restart`  
To stop the bot run `docker-compose down`  
To start it again run `docker-compose up -d`  

## Installing with docker
Minimal method
1. Run `docker pull smallketchup/ybot` (optional since next step basically does this for you)
2. Then run `docker run -v ybotdb:/app/data --env TOKEN=token_here --restart always --name ybot -d smallketchup/ybot`

Refer to the docker docs for help with starting/restarting/stopping.

# Configuration
The configuration file is config.json. When you first clone the repository you will see config.json.example. Rename that file to config.json and fill it in

## Configuration options:

**Token:** Your bot's token  
**Ownerids:** An array of user id's which the bot will consider as owners. The bot will only respond to these users. Put the id's in the quotations and seperate each id with semicolons. Example: `[ "id1", "id2", "id3", ...]`  
**Activity:** Here you can customize the bot's activity. Its set to "Watching the english dictionary" (`["the english dictionary", "WATCHING"]`) by default. To change the status, change the first object in the array with the message you want the bot to have in its status. The second object in the array lets you pick what type of status the bot should have, refer to the [discord.js docs](https://discord.js.org/#/docs/discord.js/stable/typedef/ActivityType) to see what you can set it as.  
**Delay:** This sets the delay between messages that the bot sends. By default there is no delay and the bot lets Discord.js manage the requests to comply with ratelimits. However you might find it favorable to have your own custom delay in there (discord.js will still make sure it complies with ratelimits even if you set a delay). The minimum delay is 1, the maximum is 30, to disable it set it to false. The delay is is seconds  

# Commands
`y!start` Run this in a channel that the bot has access to, the bot will start sending every single word in the english dictionary one by one.  
`y!stop` This stops the bot's currently running process. To resume run `y!start` again, the bot will start where it left off.  
`y!reset` Use this after running `y!stop` or when the bot is idle. This command resets the bot's progress back to 0. **This will remove your current progress**.  

# FAQ
**Q: Can I use this bot in multiple servers?**  
Yes, but it will only send messages in one server at a time as you cannot run `y!start` when the bot is already active.

**Q: Will selfhosting this bot get me banned from discord?**  
I don't really know. So far it hasn't happened to me but because the bot is constantly sending api requests to discord for a couple days with no break, discord could get suspicious and increase ratelimits or temporarily ban the bot from accessing the discord api for a few hours. Discord.js automatically delays requests to comply with ratelimits, so you don't have to worry about exceeding ratelimits thankfully.

# Help
For support with ybot you can direct message me on discord sugondese#5733
