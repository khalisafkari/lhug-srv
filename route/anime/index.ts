import { Router, IRouter, Request, Response } from 'express'
import { Home, Episode, Video, Search } from '../../anime'
import { convertNumber } from '../../connector'
import genre from './genre'
import anime from './anime'
import group from './group'
import production from './production'
import Type from './type'
import status from './status'
import source from './source'
import resolution from './resolution'
import ContentRating from './content-rating'
import playlist from './playlist'

const app: IRouter = Router()

const errorStatus = (res: Response) => {
  return res.status(403).send('Forbidden')
}

app.use('/genre', genre)
app.use('/anime', anime)
app.use('/group', group)
app.use('/production', production)
app.use('/type', Type)
app.use('/status', status)
app.use('/source', source)
app.use('/resolution', resolution)
app.use('/content-rating', ContentRating)
app.use('/playlist', playlist)

app.get('/search', async (req: Request, res: Response) => {
  const q = req.query.q
  const page = convertNumber(req.query.page)

  if (!q) {
    return res.status(404).send({
      message: 'not found',
      code: 404
    })
  }

  try {
    const data = await Search(q, page)
    return res.status(200).send(data)
  } catch (e) {
    return errorStatus(res)
  }
})

app.route('/')
  .get(async (req: Request, res: Response) => {
    try {
      const data = await Home()
      return res.status(200).send(data)
    } catch (e) {
      return errorStatus(res)
    }
  })

app.route('/episode')
  .get(async (req: Request, res: Response) => {
    const page = req.query.page
    if (!page) {
      const data = await Episode()
      return res.status(200).send(data)
    }

    try {
      const data = await Episode(convertNumber(page))
      return res.status(200).send(data)
    } catch (e) {
      return errorStatus(res)
    }
  })

app.get('/video', async (req: Request, res: Response) => {
  const url = req.query.url
  if (!url) {
    return errorStatus(res)
  }

  try {
    const data = await Video(url)
    return res.status(200).send(data)
  } catch (e) {
    return errorStatus(res)
  }
})

export default app
