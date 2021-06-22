import { IRouter, Response, Router } from 'express'
import { convertContent } from '../../connector'
import wrapper, { request } from '../../utils/mysql'

const app: IRouter = Router()

app.get('/:id', wrapper(async (req: request, res: Response) => {
  const data = await req.db.query(`
  select w_manga_mangas.*, COUNT(w_manga_bookmark.id) as fav 
  from w_manga_mangas 
  INNER JOIN w_manga_bookmark 
  ON w_manga_mangas.id = w_manga_bookmark.manga 
  where w_manga_mangas.id = ?
  `, [req.params.id])
  const genres = data[0].genres ? data[0].genres.split(',') : []
  return res.send({
    ...data[0],
    genres
  })
}))

app.get('/:id/chapter', wrapper(async (req: request, res: Response) => {
  const data = await req.db.query('select id, name, chapter, mid, manga, views, last_update, submitter, hidden from w_manga_chapters where mid = ? ORDER BY id ASC', [req.params.id])
  return res.send(data)
}))

app.get('/:id/chapter/:chapter', wrapper(async (req: request, res: Response) => {
  const data = await req.db.query('select * from w_manga_chapters where mid = ? and id = ?', [req.params.id, req.params.chapter])
  const next = await req.db.query('select id, name, chapter, mid, manga, views, last_update, submitter, hidden from w_manga_chapters where mid = ? and id > ? order by id asc limit 1', [req.params.id, data[0].id])
  const prev = await req.db.query('select id, name, chapter, mid, manga, views, last_update, submitter, hidden from w_manga_chapters where mid = ? and id < ? order by id asc limit 1', [req.params.id, data[0].id])
  return res.send({
    data: data[0]
      ? {
          ...data[0],
          content: convertContent(data[0].content)
        }
      : null,
    prev: prev[0] ? prev[0] : null,
    next: next[0] ? next[0] : null
  })
}))

export default app
