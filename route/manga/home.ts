import { IRouter, Response, Router } from 'express'
import slugify from 'slugify'
import { errorStatus } from '../../connector'
import wrapper, { request } from '../../utils/mysql'

const app: IRouter = Router()

app.get('/', wrapper(async (req: request, res: Response) => {
  try {
    const data = await req.db.query('select * from w_setting')
    const todos: any = {}
    for (let i = 0; i < data.length; i++) {
      todos[slugify(data[i].title)] = {
        id: data[i].id,
        title: data[i].title,
        data: await req.db.query(data[i].content)
      }
    }
    return res.status(200).send(todos)
  } catch (e) {
    return res.status(403).send(errorStatus())
  }
}))

app.get('/:id', wrapper(async (req: request, res: Response) => {
  const id = req.params.id
  if (!id) {
    return res.status(403).send(errorStatus('not valid'))
  }

  try {
    const data = await req.db.query('select * from w_setting where id = ?', [id])
    const results = {
      id: data[0].id,
      title: data[0].title,
      data: await req.db.query(data[0].content)
    }
    return res.send(results)
  } catch (e) {
    return res.status(403).send(errorStatus())
  }
}))

export default app
