import Cheerio from 'cheerio'
import { error } from '../utils/log'
import core from './url'

const get = async (url: string) => {
  if (!url) {
    return {
      message: 'limit'
    }
  }

  try {
    const data = await core.get(url)
    const $ = Cheerio.load(data.data)
    const list = $('video source').map((index, element) => ({
      id: $(element).attr('src')?.trim(),
      title: $(element).attr('title')?.trim(),
      type: $(element).attr('type')?.trim()
    })).get()
    return {
      list,
      message: 'success'
    }
  } catch (e) {
    error.error(`${e.toString()}`, {
      date: new Date(),
      route: 'source'
    })
    return e
  }
}

export default (url: string | any) => {
  return new Promise((resolve, reject) => {
    get(url).then(resolve).catch(reject)
  })
}
