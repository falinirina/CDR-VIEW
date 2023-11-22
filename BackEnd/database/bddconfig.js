const Pool = require('pg').Pool
const pool = new Pool({
    user: 'application',
    host: '10.42.0.188',
    database: 'asterisk',
    password: 'application',
    port: 5432,
})

module.exports = pool