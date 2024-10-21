const db = require('../db')

const Station = {

    findAll: function() {
        const sql = `
            SELECT * 
            FROM petrol_stations
            LIMIT 400;
        `

        return db.query(sql)
            .then(result => result.rows)
    },

    findAllByColumn: function(column) {
        const sql = `
            SELECT ${column} 
            FROM petrol_stations
            LIMIT 400;
        `

        return db.query(sql)
            .then(result => result.rows)
    }

}

module.exports = Station
