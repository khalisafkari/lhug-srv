import { Router, IRouter, Request, Response } from 'express'
import { Production, productionAnime, productionDetail } from '../../anime'
import { convertNumber } from '../../connector'

const app: IRouter = Router()

app.get('/', async (req: Request, res: Response) => {
  const page = convertNumber(req.query.page)

  try {
    const data = await Production(page)
    return res.status(200).send(data)
  } catch (e) {
    return res.status(403).send('Forbidden')
  }
})

app.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  if (!id) return res.status(403).send('Forbidden')

  try {
    const data = await productionDetail(id)
    return res.status(200).send(data)
  } catch (e) {
    return res.status(403).send('Forbidden')
  }
})

app.get('/:id/anime', async (req: Request, res: Response) => {
  const id = req.params.id
  const page = convertNumber(req.query.page)

  if (!id) return res.status(403).send('Forbidden')

  try {
    const data = await productionAnime(id, page)
    return res.status(200).send(data)
  } catch (e) {
    return res.status(403).send('Forbidden')
  }
})

export default app
