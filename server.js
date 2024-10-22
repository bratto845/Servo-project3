require('dotenv').config()


const express = require('express')
const app = express()
const port = process.env.PORT || 4567

const db = require('./db')

const Station = require('./models/stations.js')
const requestLogger = require('./middlewares/request_logger')

app.set('view engine', 'ejs')

app.use(express.json())

app.use(express.static('client'))

app.use(requestLogger)

app.get('/', (req, res) => {
    Station.findAll()
        .then(data => data)
    res.render('index.ejs')
})


app.get('/api/stations/all', (req, res) => {
    Station.findAll()
        .then(data => res.json(data))
})


app.get('/api/stations', (req, res) => {
    Station.findAll()
        .then(data => res.status(200).json(data))
})

app.get('/api/postcode/:id', (req, res) => {
    let postcodeInput = req.params.id
    fetch(`http://v0.postcodeapi.com.au/suburbs/${postcodeInput}.json`, {headers: {'content-type':'application/json'}})
        .then(response => response.json())
        .then(data => res.json(data))
})

app.get('/api/stats', (req, res) => {
    Station.findStats()
        .then(data => res.json(data))
})


app.get('/api/:column', (req, res) => {
    Station.findAllByColumn(req.params.column)
        .then(data => res.status(200).json(data))
})


app.listen(port, () => {
    console.log(`listening on port ${port}`);
})