const pg = require ('pg')

const connectionString= process.env.DATABASE_URL


const pool = new pg.Pool({
    connectionString
})

module.exports = pool