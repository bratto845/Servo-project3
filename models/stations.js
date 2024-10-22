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
    }
            
}
        
    


module.exports = Station