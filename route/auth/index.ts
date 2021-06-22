import { Router, IRouter } from 'express'
import me from './me'
import login from './login'

const app: IRouter = Router()

app.use('/me', me)
app.use('/login', login)

export default app
