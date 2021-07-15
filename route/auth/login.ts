import { Router, IRouter, Response } from 'express'
import sha1 from 'sha1'
import wrapper, { request } from '../../utils/mysql'
import jwt from 'jsonwebtoken'
import { errorStatus } from '../../connector'

const app: IRouter = Router()

app.get('/', wrapper(async (req: request, res: Response) => {
  const body: {
      email: string | any;
      pass: string | any
  } = {
    email: req.query.email ?? req.body.email,
    pass: req.query.pass ?? req.body.password
  }

  let data: any

  try {
    data = await req.db.query('select * from w_user where email = ? and password = ?', [body.email, sha1(body.pass)])
    if (data.length <= 0) {
      return res.status(403).send(errorStatus('forbidden'))
    }
    const results = {
      message: 'success',
      token: jwt.sign({
        id: data[0].id,
        email: data[0].email,
        role: data[0].role
      }, Buffer.from(`${process.env.JWT_TOKEN}`, 'base64'), {
        expiresIn: '365d',
	algorithm: 'HS256'
      })
    }
    return res.status(200).send(results)
  } catch (e) {
    return res.status(403).send(errorStatus('forbidden'))
  } finally {
    if (data.length > 0) {
      await req.db.query('update w_user set last_login = CURRENT_TIMESTAMP where email = ? ', [body.email])
      console.log(`update at last_login : ${new Date()} email: ${body.email}`)
      await req.db.end()
    }
  }
}))

export default app
