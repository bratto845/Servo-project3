require('dotenv').config()

const express = require('express')

const app = express()
const port = process.env.PORT || 4567
const db= require('./db')

app.use(express.json())


app.use(express.static('client'))



app.get('/', (req, res)=>{
    res.send('hello world')
})



app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
    
})