import { Request, Response } from 'express'
import mariadb from 'mariadb'

const sql = mariadb.createPool({
  host: '127.0.0.1',
  user: 'lovehug',
  password: 'lovehugdotcom@@',
  connectionLimit: 10,
  database: 'lovehug'
})

export interface request extends Request {
    db?: mariadb.PoolConnection | any
    user?: any
}

const wrapper = (fn: any) => {
  return async (req: request, res: Response) => {
    req.db = await sql.getConnection()
    await req.db.ping()
    await fn(req, res)
    await req.db.end()
  }
}

export default wrapper
