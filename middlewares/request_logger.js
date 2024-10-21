function requestLogger(req, res, next)  {
    console.log(`\n+-------------------------------------------+`)
    console.log(new Date().toLocaleString())
    console.log(`${req.method} ${req.path}`)
    console.log(`body `, req.body)
    console.log(`+-------------------------------------------+\n`)
    next()
}

module.exports = requestLogger