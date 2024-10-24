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
    },

    findStats: async function() {
        const sql = `
            SELECT
            owner, COUNT(id)
            FROM petrol_stations
            GROUP BY owner;
        `
        let owners = {
            owners: []
        }
        
        let totalStationsCount = 0
        
        let random = await db.query(sql)
            .then(res => {
                for (let owner of res.rows) {
                    if (owner.count > 1) {
                        owners.owners.push(owner)
                    }
                    totalStationsCount += Number(owner.count)           
                } 
            owners.total_owners = res.rows.length
            owners.total_stations = totalStationsCount
            })
        return owners                    
    },
    findRandom: function(){
        const sql = `
            SELECT *
            FROM petrol_stations
            ORDER BY RANDOM() LIMIT 1;
        `

        return db.query(sql)
            .then(res => res.rows[0])
    },
    findAllByBounds: function(lat1, lat2, long1, long2) {
        const sql = `
            SELECT * 
            FROM petrol_stations
            WHERE latitude BETWEEN $1 AND $2 AND longitude BETWEEN $3 AND $4
            LIMIT 700;
        `

        return db.query(sql, [lat1, lat2, long1, long2]) 
            .then(result => result.rows)
    },
    
            
}



module.exports = Station