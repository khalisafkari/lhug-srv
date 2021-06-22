import { IRouter, Response, Router, json, urlencoded } from 'express'
import jwt from 'express-jwt'
import wrapper, { request } from '../../utils/mysql'

const app: IRouter = Router()

app.use(json())
app.use(urlencoded({ extended: false }))

app.route('/:id')
  .get(wrapper(async (req: request, res: Response) => {
    const comment = await req.db.query('select * from w_manga_comments where manga = ? order by id asc', [req.params.id])
    return res.send(comment)
  }))
  .post(jwt({ secret: Buffer.from(`${process.env.JWT_TOKEN}`, 'base64'), algorithms: ['HS256'], credentialsRequired: false }),
    wrapper(async (req:request, res: Response) => {
      if (!req.user) {
        return res.status(403).send('forbidden')
      }
      if (!req.body.message) {
        return res.status(403).send({ message: 'required message value' })
      }
      await req.db.query('insert into w_manga_comments (manga, content, time, user_id, user_rep) values (?,?,CURRENT_TIMESTAMP,?,?)', [
        req.params.id,
        req.body.message,
        req.user.id,
        0
      ])
      return res.send('done')
    }))

app.route('/:id/ch/:ch')
  .get(wrapper(async (req: request, res: Response) => {
    const comment = await req.db.query('select * from w_manga_comments where manga = ? and chapter_id = ?', [req.params.id, req.params.ch])
    return res.send(comment)
  }))
  .post(jwt({ secret: Buffer.from(`${process.env.JWT_TOKEN}`, 'base64'), algorithms: ['HS256'], credentialsRequired: false }),
    wrapper(async (req: request, res: Response) => {
      if (!req.user) {
        return res.status(403).send('forbidden')
      }
      if (!req.body.message) {
        return res.status(403).send({ message: 'required message value' })
      }
      const getCh = await req.db.query('select chapter from w_manga_chapters where mid = ? and id = ?', [req.params.id, req.params.ch])
      await req.db.query(`
      insert into 
      w_manga_comments (manga, content, time, user_id, user_rep, chapter_id, chapter) 
      values (?,?,CURRENT_TIMESTAMP,?,?,?,?)
      `, [
        req.params.id,
        req.body.message,
        req.user.id,
        0,
        req.params.ch,
        getCh[0].chapter
      ])
      return res.send({ message: 'success', code: 201, status: 'send' })
    }))

export default app
