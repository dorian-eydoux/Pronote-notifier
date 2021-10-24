# Pronote notifier
Notify Pronote changes using a Discord webhook

## Requirement
Node.js >=16.6.0

## Set up
### Step 1
Install dependancies with npm
```
npm i --only=prod
```

### Step 2
Load environement variables or create `.env` file like:
```
PRONOTE_URL=https://demo.index-education.net/pronote/
PRONOTE_USERNAME=demonstration
PRONOTE_PASSWORD=pronotevs
DISCORD_MARK_WEBHOOK=https://discord.com/api/webhooks/123456789/abc
```

\
Then **Pronote notifier** is ready!

## Usage
It is recommended to run **Pronote notifier** every 15 minutes, which allows you to receive changes on Pronote quickly enough and avoid being rate limited

Here is an example with a Cron job:
```shell
0,15,30,45 * * * * cd /path/to/Pronote-notifier; ./index.js
```
