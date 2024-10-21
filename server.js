require('dotenv').config()

const express = require('express')

const app = express()
const port = process.env.PORT || 4567
const db = require('./db')

app.use(express.json())

app.use(express.static('client'))

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index.ejs')
})



app.listen(port, () => {
    console.log(`listening on port ${port}`);
})