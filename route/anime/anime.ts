import { Router, IRouter, Request, Response } from 'express'
import { Anime, AnimeDetail, AnimeEpisode } from '../../anime'
import { convertNumber, errorStatus } from '../../connector'

const app: IRouter = Router()

app.get('/', async (req: Request, res: Response) => {
  const page: number = convertNumber(req.query.page)
  try {
    const data = await Anime(page)
    return res.status(200).send(data)
  } catch (e) {
    return res.status(403).send('Forbidden')
  }
})

app.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id

  if (!id) return res.status(403).send(errorStatus())

  try {
    const data = await AnimeDetail(id)
    return res.status(200).send(data)
  } catch (e) {
    return res.send(errorStatus())
  }
})

app.get('/:id/episode', async (req: Request, res: Response) => {
  const id = req.params.id

  if (!id) return res.status(403).send(errorStatus())

  try {
    const data = await AnimeEpisode(id)
    return res.status(200).send(data)
  } catch (e) {
    return res.status(403).send(errorStatus())
  }
})

export default app
