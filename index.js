#!/usr/bin/env node
require('dotenv').config()
const { login } = require('@dorian-eydoux/pronote-api')
const { existsSync, mkdirSync, writeFileSync } = require('fs')
const { publishMark, publishLesson } = require('./discord')

const { PRONOTE_URL, PRONOTE_USERNAME, PRONOTE_PASSWORD } = process.env
const TIMETABLE_RANGE = require('ms')(process.env.TIMETABLE_RANGE || '1w')
let init = true
const dir = './data'
const files = {
    marks: 'marks.json',
    timetable: 'timetable.json'
}

if (!existsSync(dir)) {
    init = false
    console.info('Data will be initialized')
}

(async () => {
    const session = await login(PRONOTE_URL, PRONOTE_USERNAME, PRONOTE_PASSWORD)
    console.info(`Pronote client logged in as ${session.user.name} ${session.user.studentClass.name}`)

    const subjects = (await session.marks()).subjects
        .reduce((subjects, subject) => {
            if (!subjects[subject.name]) subjects[subject.name] = subject
            return subjects
        }, {})
    const marks = Object.keys(subjects)
        .map(subject => subjects[subject].marks.map(mark => {
            mark.subject = subject
            return mark
        }))
        .flat()
        .sort((a, b) => a.date - b.date)
        .reduce((marks, mark) => {
            mark.value = mark.value || -1
            marks[mark.id] = mark
            return marks
        }, {})

    const from = new Date()
    const timetable = (await session.timetable(from, new Date(from.getTime() + TIMETABLE_RANGE)))
        .filter(({ status, hasDuplicate, isAway, isCancelled }) => status && !(hasDuplicate && (isAway || isCancelled))) // Filters out non-duplicated lessons with a status
        .reduce((lessons, lesson) => {
            lessons[lesson.id] = lesson
            return lessons
        }, {})

    const messages = []
    if (init) {
        const oldMarks = require(`${dir}/${files.marks}`)
        const oldTimetable = require(`${dir}/${files.timetable}`)

        Object.keys(marks).forEach(id => {
            const mark = marks[id]
            const { value, average } = mark
            const oldMark = oldMarks[id]
            let kind

            if (!oldMark) { kind = 'new' }
            else if (value !== oldMark) { kind = 'update'}
            else return

            if (!average) return // Skip empty marks

            console.info(`${kind === 'new' ? 'New mark' : 'Mark changed'}: ${id}`)
            messages.push(publishMark(kind, mark, subjects[mark.subject]))
        })
        Object.keys(timetable).forEach(id => {
            const lesson = timetable[id]
            const { status } = lesson
            const oldLesson = oldTimetable[id]

            if (status !== oldLesson) {
                console.info(`Lesson status changed: ${id}`)
                messages.push(publishLesson(lesson))
            }
        })
    } else mkdirSync(dir)

    Object.keys(marks).map(mark => {
        marks[mark] = marks[mark].value
    })
    Object.keys(timetable).map(lesson => {
        timetable[lesson] = timetable[lesson].status
    })

    writeFileSync(`${dir}/${files.marks}`, JSON.stringify(marks, null, 2))
    writeFileSync(`${dir}/${files.timetable}`, JSON.stringify(timetable, null, 2))

    await Promise.all(messages)
})()
