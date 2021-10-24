const { WebhookClient, MessageEmbed } = require('discord.js')

const webhooks = {
    marks: new WebhookClient({ url: process.env.DISCORD_MARK_WEBHOOK }),
}

function publishMark(kind, mark, subject) {
    const embed = new MessageEmbed()
        .setColor(subject.color)
        .setTitle(`**${kind === 'new' ? 'Nouvelle note' : 'Note changé'}**`)
        .setDescription(`\`${mark.value}/${mark.scale}\` en ${mark.subject}`)
        .setTimestamp(mark.date)
    return webhooks.marks.send({ embeds: [embed] })
}

module.exports = { publishMark }
