const { Pool } = require('pg')

const DbConfig = {
    user: 'postgres',
    host: 'db.fpdrkanhbobfsxpcmsap.supabase.co',
    database: 'postgres',
    password: 'Dn9htJAQ_m3GthK',
    port: 5432
}

export async function executeSQL(sqlScript) {

    try {
        const pool = new Pool(DbConfig)
        const client = await pool.connect()

        const result = await client.query(sqlScript)
        console.log(result.rows)

    } catch (error) {
        console.log('Erro ao executar SQL ' + error)
    }

}