import { Router, IRouter, Request, Response } from 'express'
import { Resolution, resolutionAll } from '../../anime'
import { convertNumber, errorStatus } from '../../connector'

const app: IRouter = Router()

app.get('/', async (req: Request, res: Response) => {
  try {
    const data = await Resolution()
    return res.status(200).send(data)
  } catch (e) {
    return res.status(403).send(errorStatus())
  }
})

app.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  const page = convertNumber(req.query.page)

  if (!id) return res.status(403).send(errorStatus())

  try {
    const data = await resolutionAll(id, page)
    return res.status(200).send(data)
  } catch (e) {
    return res.status(403).send(errorStatus())
  }
})

export default app
