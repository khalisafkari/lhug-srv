import { Router, IRouter, Request, Response } from 'express'
import { Playlist, playListId } from '../../anime'
import { convertNumber, errorStatus } from '../../connector'

const app: IRouter = Router()

app.get('/', async (req: Request, res: Response) => {
  const page = req.query.page
  if (!page) {
    try {
      const data = await Playlist()
      return res.status(200).send(data)
    } catch (e) {
      return res.status(403).send(errorStatus())
    }
  }

  try {
    const data = await Playlist(convertNumber(page))
    return res.status(200).send(data)
  } catch (e) {
    return res.status(403).send(errorStatus())
  }
})

app.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  if (!id) {
    return res.status(403).send(errorStatus('not valid'))
  }

  try {
    const data = await playListId(id)
    return res.status(200).send(data)
  } catch (e) {
    return res.status(403).send(errorStatus())
  }
})

export default app
