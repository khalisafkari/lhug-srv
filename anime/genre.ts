import Cheerio from 'cheerio'
import { convertNumber } from '../connector'
import { error } from '../utils/log'
import core from './url'

const get = async (page?: number) => {
  try {
    const data = await core.get(`/genre${page ? `?page=${page}` : ''}`)
    const $ = Cheerio.load(data.data)

    const genre = $('main .loop li a').map((index, element) => ({
      id: $(element).attr('href')?.trim().replace('https://tenshi.moe/genre/', ''),
      title: $(element).find('.label span').text().trim(),
      count: $(element).find('.anime_count span').text().trim()
    })).get()

    const total = $('.page-item').eq(-2).text()

    if (convertNumber(page) > convertNumber(total)) {
      return { message: 'limit' }
    } else {
      return {
        genre,
        count: genre.length * (page || 1),
        total: convertNumber(total),
        message: 'success'
      }
    }
  } catch (e) {
    error.error(`${e.toString()}`, {
      date: new Date(),
      route: 'genre'
    })
    throw new Error(e)
  }
}

export const genreList = async (id: string, page?: number) => {
  if (!id) return { message: 'limit' }

  try {
    const data = await core.get(`/genre/${id}${page ? `?page=${page}` : ''}`, {
      withCredentials: true,
      headers: {
        Cookie: 'loop-view=thumb;'
      }
    })
    const $ = Cheerio.load(data.data)
    const list = $('main .loop li a').map((index, elemenet) => ({
      id: $(elemenet).attr('href')?.trim().replace('https://tenshi.moe/anime/', '').replace(/\/[\d+]/gi, ''),
      title: $(elemenet).attr('title')?.trim(),
      meta: {
        image: {
          alt: $(elemenet).find('img').attr('alt'),
          url: $(elemenet).find('img').attr('src')
        }
      },
      views: $(elemenet).find('.views').text().trim(),
      rate: $(elemenet).find('.rating').text().trim(),
      overlay: $(elemenet).find('.overlay span').text().trim()
    })).get()

    const total = $('.page-item').eq(-2).text()

    if (convertNumber(page) > convertNumber(total)) {
      return {
        message: 'limit'
      }
    } else {
      return {
        list,
        count: list.length * (page || 1),
        page: page || 1,
        total: convertNumber(total),
        message: 'success'
      }
    }
  } catch (e) {
    error.error(`${e.toString()}`, {
      date: new Date(),
      route: 'genre list'
    })
    throw new Error(e)
  }
}

export default (page?: number | any) => {
  return new Promise((resolve, reject) => {
    get(page).then(resolve).catch(reject)
  })
}
