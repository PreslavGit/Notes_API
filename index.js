import express from 'express'
import cors from 'cors'
import Note from './src/Note.js'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const notes = []

let id = 1
function getId() {
    return id++
}

app.get('/get/all', (req, res) => {
    res.send(JSON.stringify(notes))
})

app.get('/get/:id', (req, res) => {
    const noteId = Number(req.params.id)
    if(isNaN(noteId)){
        res.status(400).send({ error: "Parameter 'id' should be a valid number"})
    }

    const foundNote = notes.find(n => n.id === noteId)
    if(foundNote){
        res.send(JSON.stringify(foundNote))
    } else {
        res.sendStatus(404)
    }
    
})

app.post('/create', (req, res) => {
    const body = req.body
    if(!body.title){
        res.status(400).send({ error: "Please provide a title"})
    }

    const note = new Note(body.title, body.content, getId())
    notes.push(note)

    res.status(200).send()
})

app.put('/edit/:id', (req, res) => {
    const noteId = Number(req.params.id)
    if(isNaN(noteId)){
        res.status(400).send({ error: "Parameter 'id' should be a valid number"})
    }

    const foundNote = notes.find(n => n.id === noteId)
    const body = req.body
    if(!body.title){
        res.status(400).send({ error: "Please provide a title"})
    }

    foundNote.title = body.title
    foundNote.content = body.content

    res.sendStatus(200)
})

app.delete('/delete/:id', (req, res) => {
    const noteId = Number(req.params.id)
    if(isNaN(noteId)){
        res.status(400).send({ error: "Parameter 'id' should be a valid number"})
    }

    const foundNoteIndex = notes.findIndex(n => n.id === req.body.id)
    if(foundNoteIndex != -1){
        notes.splice(foundNoteIndex, 1)
        res.sendStatus(200)
    } else {
        res.sendStatus(404)
    }
    
})

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})