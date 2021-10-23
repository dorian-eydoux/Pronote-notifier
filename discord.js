const { Client, MessageEmbed } = require('discord.js')
const client = new Client({ intents: ['GUILDS'] })

const channels = {}

const init = () =>
    new Promise(resolve => {
        client.login()
        client.on('ready', () => {
            console.info(`Discord client logged in as ${client.user.tag}`)
            channels.marks = client.channels.cache.get(process.env.DISCORD_MARK_CHANNEL)
            resolve()
        })
    })

function publishMark(kind, mark, subject) {
    const embed = new MessageEmbed()
        .setColor(subject.color)
        .setTitle(`**${kind === 'new' ? 'Nouvelle note' : 'Note changé'}**`)
        .setDescription(`\`${mark.value}/${mark.scale}\` en ${mark.subject}`)
        .setTimestamp(mark.date)
    return channels.marks.send({ embeds: [embed] })
}

function destroy() {
    client.destroy()
}

module.exports = { init, publishMark, destroy }
