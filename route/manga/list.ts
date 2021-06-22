import { IRouter, Response, Router } from 'express'
import { convertNumber } from '../../connector'
import wrapper, { request } from '../../utils/mysql'

const app: IRouter = Router()

app.get('/', wrapper(async (req: request, res: Response) => {
  const page = req.query.page
  const count = await req.db.query('SELECT * from w_manga_mangas')
  const data = await req.db.query('SELECT * from w_manga_mangas WHERE id > ? ORDER BY id ASC LIMIT 25', [page ? convertNumber(page) * 25 : 0])
  return res.status(200).send({
    data,
    page: page ? convertNumber(page) : 0,
    totalPage: Math.ceil(count.length / 25)
  })
}))

app.get('/search', wrapper(async (req: request, res: Response) => {
  const { s, m, a, t, g } = req.query

  if (Object.keys(req.query).length === 0) {
    return res.status(404).send({ message: 'not found', code: 404 })
  }

  const data = await req.db.query(`
    select * from w_manga_mangas
    where name LIKE ? OR slug LIKE ? OR other_name LIKE ?
    OR magazine LIKE ? or magazines LIKE ?
    OR authors LIKE ?
    OR trans_group LIKE ?
    OR genres LIKE ?
    ORDER BY id ASC LIMIT 25
  `, [
    `${s ? `%${s}%` : ''}`,
    `${s ? `%${s}%` : ''}`,
    `${s ? `%${s}%` : ''}`,
    `${m ? `%${m}%` : ''}`,
    `${m ? `%${m}%` : ''}`,
    `${a ? `%${a}%` : ''}`,
    `${t ? `%${t}%` : ''}`,
    `${g ? `%${g}%` : ''}`
  ])

  if (data.length === 0) {
    return res.status(404).send({ message: 'not found', code: 404 })
  }

  return res.send(data)
}))

app.get('/genre', wrapper(async (req: request, res: Response) => {
  try {
    const data = await req.db.query('select * from w_manga_genres')
    return res.status(200).send(data)
  } catch (e) {
    return res.status(403).send('forbidden')
  }
}))

app.get('/mangazine', wrapper(async (req: request, res: Response) => {
  try {
    const data = await req.db.query('SELECT * FROM `w_manga_magazines`')
    return res.status(200).send(data)
  } catch (e) {
    return res.status(403).send('forbidden')
  }
}))

export default app
