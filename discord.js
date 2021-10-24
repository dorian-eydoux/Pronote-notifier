const { WebhookClient, Formatters, MessageEmbed } = require('discord.js')
const { bold, inlineCode } = Formatters

const webhooks = {
    marks: new WebhookClient({ url: process.env.DISCORD_MARK_WEBHOOK }),
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
        .setFooter(id)
        .setTimestamp(date)
    return webhooks.marks.send({ embeds: [embed] })
}

module.exports = { publishMark }
