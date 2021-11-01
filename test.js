const { fork } = require('child_process')
const { join } = require('path')

const webhook = 'https://discord.com/api/webhooks/123456789/abc'
const env = {
    PRONOTE_URL: 'https://demo.index-education.net/pronote/',
    PRONOTE_USERNAME: 'demonstration',
    PRONOTE_PASSWORD: 'pronotevs',
    DISCORD_MARK_WEBHOOK: webhook,
    DISCORD_TIMETABLE_WEBHOOK: webhook
}

fork(join(__dirname, 'index.js'), { env })
