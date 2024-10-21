require('dotenv').config()


const express = require('express')
const app = express()
const port = process.env.PORT || 4567

const db = require('./db')

const Station = require('./models/stations.js')
const requestLogger = require('./middlewares/request_logger')

app.use(express.json())

app.use(express.static('client'))

app.use(requestLogger)

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/api/stations', (req, res) => {
    Station.findAll()
        .then(data => res.status(200).json(data))
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})