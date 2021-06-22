import { Router, IRouter } from 'express'
import home from './home'
import list from './list'
import post from './post'
import comment from './comment'

const app: IRouter = Router()

app.use('/home', home)
app.use('/list', list)
app.use('/post', post)
app.use('/comment', comment)

export default app
