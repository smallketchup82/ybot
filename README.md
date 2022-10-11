# ybot
ybot is a bot that puts the letter "y" before every single word in the english dictionary.  
Inspired by yname from the Galaxy Community  
# Setup
Manual method

1. Clone the repository
3. Open a terminal and go to the directory where you cloned the repository
4. Run `npm install` to install the dependencies
5. Compile with `tsc` or install [ts-node](https://www.npmjs.com/package/ts-node)
6. Rename .env.example to .env and fill it out. Move it to the dist directory
7. Cd into the dist directory and run the bot
8. Invite the bot to your discord server by creating an invite for it with the required permissions. Make sure to give the bot the `bot` and `application.commands` scopes
9. Run run /start in any channel and watch the bot go. Refer to the commands section for more commands

Make sure to check the repository every so often for updates

## Setup with docker-compose
Easiest method

1. Clone the repository
2. Rename .env.example to .env and fill it in (ensure that the .env file is in the same directory as the docker-compose.yml file)
3. Run `docker-compose up -d` in the directory where you cloned the repo  

To restart the bot run `docker-compose restart`  
To stop the bot run `docker-compose down`  
To start it again run `docker-compose up -d`  

# Commands
`/start` Run this in a channel that the bot has access to, the bot will start its process.  
`/stop hard: true | false` Soft stop pauses the bot, hard stop stops the bot and removes its progress from the database. Hard stop can be used while paused to reset progress for the next run

# Help
For support with ybot you can direct message me on discord sugondese#5733  
Pull requests & Bug reports are welcome!
