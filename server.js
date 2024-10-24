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
    // Station.findAll()
    //     .then(data => data)
    res.render('index.ejs')
})

app.get('/api/stations/favourites', (req, res) => {
    Station.findAll()
        .then(data => res.json(data))
})

app.get('/api/stations/random', (req, res)=>{
    Station.findRandom()
        .then(data =>res.json(data))
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

app.get ('/api/stations/bounds', (req, res) => {
    const lat1 = req.query.lat1
    const lat2 = req.query.lat2
    const long1 = req.query.long1
    const long2 = req.query.long2

    Station.findAllByBounds(lat1, lat2, long1, long2)
        .then(data => res.json(data))
})

app.get('/api/stations/nearest', (req, res) => {
    const lat = parseFloat(req.query.lat)
    const long = parseFloat(req.query.long)
    const radius = parseFloat(req.query.radius)

    const toRadians = degrees => degrees * (Math.PI / 180)

    const latOffset = radius / 111.32; // Latitude offset
    const lonOffset = radius / (111.32 * Math.cos(toRadians(lat))); // Longitude offset
    
    const minLat = lat - latOffset
    const maxLat = lat + latOffset
    const minLong = long - lonOffset
    const maxLong = long + lonOffset
    
    console.log(minLat, maxLat, minLong, maxLong)

    Station.findAllByBounds(minLat, maxLat, minLong, maxLong)
        .then(data => res.json(data))
})

app.get('/api/stations/matrix', (req, res) => {
    const lat = req.query.lat
    const lng = req.query.lng
    const destinations = req.query.destinations

    console.log(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${destinations}&key=${ process.env.GOOGLE_MAPS_API }`)

    fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${destinations}&key=${ process.env.GOOGLE_MAPS_API }`)
        .then(response => response.json())
        .then(data => res.json(data))
})

app.patch ('/api/stations/:id/save', (req, res) => {
    Station.saveStation(req.params.id)
        .then(data => res.json(data))
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})