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
Load environement variables:
- `PRONOTE_URL` ; `PRONOTE_USERNAME` ; `PRONOTE_PASSWORD` specify your Pronote establishment URL and logins. Example: `https://demo.index-education.net/pronote/` ; `demonstration` ; `pronotevs`
- `DISCORD_MARK_WEBHOOK` ; `DISCORD_TIMETABLE_WEBHOOK` set Discord webhooks do you want to resquest for new or updated marks and timetable updates. Example: `https://discord.com/api/webhooks/123456789/abc`
- `TIMETABLE_RANGE` set time range of checking timetable updates. Example: `1 week` `5 days` `3d` `48h`. Default: `1w`

Then **Pronote notifier** is ready!

You can create a `.env` file at the root of the project, then when the application is launched, this file will be loaded automatically. Example:
```
PRONOTE_URL=https://demo.index-education.net/pronote/
PRONOTE_USERNAME=demonstration
PRONOTE_PASSWORD=pronotevs
DISCORD_MARK_WEBHOOK=https://discord.com/api/webhooks/123456789/abc
DISCORD_TIMETABLE_WEBHOOK=https://discord.com/api/webhooks/123456789/abc
TIMETABLE_RANGE=1w
```
## Usage
It is recommended to run **Pronote notifier** every 15 minutes, which allows you to receive Pronote changes quickly enough and avoid being rate limited

Here is an example with a Cron job:
```shell
0,15,30,45 * * * * cd /path/to/Pronote-notifier; ./index.js
```
