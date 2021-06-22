import { Router, IRouter, Response } from 'express'
import wrapper, { request } from '../../utils/mysql'
import jwt from 'express-jwt'
import gravatarUrl from '../../utils/gravatarUrl'

const app: IRouter = Router()

app.use(jwt({
  secret: Buffer.from(`${process.env.JWT_TOKEN}`, 'base64'),
  algorithms: ['HS256'],
  credentialsRequired: true,
  getToken: function token (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    }
    return null
  }
}))

app.use(function (err: any, req: any, res: any, next: any) {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: err.message, code: err.code, status: err.status })
    return
  }
  next()
})

app.get('/', wrapper(async (req: request, res: Response) => {
  if (req.user) {
    const data = await req.db.query('select * from w_user where id = ? ', [req.user.id])
    return res.send({
      user: {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        role: data[0].role,
        last_login: data[0].last_login,
        register_ip: data[0].register_ip,
        register_date: data[0].register_date,
        group_uploader: data[0].group_uploader
      },
      avatar: gravatarUrl(data[0].email, { size: 200 })
    })
  }
}))

app.get('/bookmark', wrapper(async (req: request, res: Response) => {
  if (req.user) {
    const data = await req.db.query(`
      SELECT w_manga_mangas.*, w_manga_notification.see as see FROM w_manga_bookmark 
      INNER JOIN w_manga_mangas ON w_manga_mangas.id = w_manga_bookmark.manga 
      LEFT JOIN w_manga_notification ON w_manga_notification.user = w_manga_bookmark.user 
      AND w_manga_notification.mid = w_manga_mangas.id 
      WHERE w_manga_bookmark.user = ?
      GROUP BY w_manga_mangas.id, 
      w_manga_notification.mid 
      ORDER BY w_manga_mangas.last_update DESC
    `, [req.user.id])

    // eslint-disable-next-line array-callback-return
    data.map((item: any) => {
      item.see = item.see === 0
    })

    return res.send(data)
  }
}))

app.get('/bookmark/add/:id', wrapper(async (req: request, res: Response) => {
  if (req.user && req.params.id) {
    await req.db.query('insert into w_manga_bookmark (user, manga) values (?,?)', [req.user.id, req.params.id])
    return res.status(201).send({
      code: 201,
      message: 'success',
      status: 'add'
    })
  } else {
    return res.status(403).send('forbidden')
  }
}))

app.get('/bookmark/del/:id', wrapper(async (req: request, res: Response) => {
  if (req.user && req.params.id) {
    await req.db.query('delete from w_manga_bookmark where user = ? and manga = ?', [req.user.id, req.params.id])
    return res.status(201).send({
      code: 201,
      message: 'success',
      status: 'del'
    })
  } else {
    return res.status(403).send('forbidden')
  }
}))

app.get('/bookmark/read/:id', wrapper(async (req: request, res: Response) => {
  if (req.user && req.params.id) {
    await req.db.query('update w_manga_notification set see = 1 where user = ? and mid = ?', [req.user.id, req.params.id])
    return res.status(201).send('success')
  } else {
    return res.status(403).send('forbidden')
  }
}))

app.get('/notification', wrapper(async (req:request, res: Response) => {
  if (req.user) {
    const data = await req.db.query('select * from w_manga_notification where user = ? ', [req.user.id])
    return res.send(data)
  }
}))

export default app
