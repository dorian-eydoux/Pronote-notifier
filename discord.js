const { WebhookClient, Formatters, MessageEmbed } = require('discord.js')
const { bold, inlineCode, time } = Formatters

const webhooks = {
    marks: new WebhookClient({ url: process.env.DISCORD_MARK_WEBHOOK }),
    timetable: new WebhookClient({ url: process.env.DISCORD_TIMETABLE_WEBHOOK })
}

function publishMark(kind, mark, subject) {
    const { average, max, min, coefficient, scale, title, isAway, value, id, date } = mark

    let descriptions = [`±${average}`, `+${max}`, `-${min}`]
    if (coefficient !== 1) descriptions.splice(0, 0, `×${coefficient}`)
    if (scale !== 20) descriptions.splice(0, 0, `/${scale}`)
    descriptions = descriptions
        .map(inlineCode)
        .join(' ')

    const embed = new MessageEmbed()
        .setColor(subject.color)
        .setTitle(bold((kind === 'new' ? 'Nouvelle note' : 'Note changé') + (title ? ` "${title}"`: '')))
        .setDescription(`${bold(isAway ? 'Non noté' : value)} en ${subject.name}\n${descriptions}`)
        .setFooter({ text: id })
        .setTimestamp(date)
    return webhooks.marks.send({ embeds: [embed] })
}

function publishLesson({ color, status, subject, from, to, room, id }) {
    const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(bold(status))
        .setDescription(subject)
        .addField('Début', time(from, 'R'), true)
        .addField('Fin', time(to, 'R'), true)
        .addField('Salle', room || 'Inconnu')
        .setFooter({ text: id })
    return webhooks.timetable.send({ embeds: [embed] })
}

module.exports = { publishMark, publishLesson }
