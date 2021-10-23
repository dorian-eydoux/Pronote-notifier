require('dotenv').config()
const { login } = require('@dorian-eydoux/pronote-api')
const { existsSync, mkdirSync, writeFileSync } = require('fs')
const discord = require('./discord')

const { PRONOTE_URL, PRONOTE_USERNAME, PRONOTE_PASSWORD } = process.env
let init = true
const dir = './data'
const files = {
    marks: 'marks.json',
}

if (!existsSync(dir)) {
    init = false
    mkdirSync(dir)
}

(async () => {
    const session = await login(PRONOTE_URL, PRONOTE_USERNAME, PRONOTE_PASSWORD)
    console.info(`Pronote client logged in as ${session.user.name} ${session.user.studentClass.name}`)

    const subjects = (await session.marks()).subjects
        .reduce((subjects, subject) => {
            const name = subject.name
            delete subject.name
            subjects[name] = subject
            return subjects
        }, {})

    const marks = Object.keys(subjects)
        .map((subject) => subjects[subject].marks.map(mark => {
            mark.subject = subject
            return mark
        }))
        .flat()
        .reduce((marks, mark) => {
            const id = mark.id
            delete mark.id
            mark.value = mark.value || -1
            marks[id] = mark
            return marks
        }, {})

    const messages = []

    if (init) {
        await discord.init()
        const oldMarks = require(`${dir}/${files.marks}`)
        Object.keys(marks).forEach(id => {
            const mark = marks[id]
            const oldMark = oldMarks[id]
            let kind

            if (!oldMark) {
                kind = 'new'
            } else if (mark.value !== oldMark) {
                kind = 'update'
            } else return

            console.info(`${kind === 'new' ? 'New mark' : 'Mark changed'}: ${id}`)
            messages.push(discord.publishMark(kind, mark, subjects[mark.subject]))
        })
    } else console.info('Data will be initialized')

    Object.keys(marks).map((mark) => {
        marks[mark] = marks[mark].value
    })
    writeFileSync(`${dir}/${files.marks}`, JSON.stringify(marks, null, 4))

    await Promise.all(messages)
    discord.destroy()
})()

