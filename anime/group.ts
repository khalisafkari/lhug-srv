import Cheerio from 'cheerio'
import { convertNumber } from '../connector'
import { error } from '../utils/log'
import core from './url'

const get = async (page?: number) => {
  try {
    const data = await core.get(`/group${page ? `?page=${page}` : ''}`, {
      withCredentials: true,
      headers: {
        Cookie: 'loop-view=thumb;'
      }
    })
    const $ = Cheerio.load(data.data)

    const list = $('main .loop li a').map((index, elemenet) => ({
      id: $(elemenet).attr('href')?.trim().replace('https://tenshi.moe/group/', '').replace(/\/[\d+]/gi, ''),
      title: $(elemenet).attr('title')?.trim(),
      meta: {
        image: {
          alt: $(elemenet).find('img').attr('alt'),
          url: $(elemenet).find('img').attr('src')
        }
      }
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
      route: 'group'
    })
    throw new Error(e)
  }
}

export const groupDetail = async (id: string) => {
  if (!id) return { message: 'limit' }

  try {
    const data = await core.get(`/group/${id}`)
    const $ = Cheerio.load(data.data)
    const title = $('main article header h1').text().trim()
    const image = $('main article .entry-content div .side-info .cover-area img').attr('src')?.trim()
    const alt = $('main article .entry-content div .side-info .cover-area img').attr('title')?.trim() ?? $('main article .entry-content div .side-info .cover-area img').attr('alt')?.trim()

    const tag = $('main article .entry-content div .main-info .info-list li:nth-child(1) .value').text().trim()
    const site = $('main article .entry-content div .main-info .info-list li:nth-child(2) .value').text().trim()

    const description = $('main article .entry-description .card-body').text().trim()

    return {
      title,
      meta: {
        image: {
          alt: alt,
          url: image
        }
      },
      tag,
      site,
      description
    }
  } catch (e) {
    error.error(`${e.toString()}`, {
      date: new Date(),
      route: 'group detail'
    })
    throw new Error(e)
  }
}

export const groupAnime = async (id: string, page?: number) => {
  if (!id) return { message: 'limit' }

  try {
    const data = await core.get(`/group/${id}${page ? `?page=${page}` : ''}`, {
      withCredentials: true,
      headers: {
        Cookie: 'loop-view=thumb;'
      }
    })
    const $ = Cheerio.load(data.data)
    const list = $('main .loop li a').map((index, elemenet) => ({
      id: $(elemenet).attr('href')?.replace('https://tenshi.moe/anime/', ''),
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
      route: 'group detail'
    })
    throw new Error(e)
  }
}

export default (page?: number) => {
  return new Promise((resolve, reject) => {
    get(page).then(resolve).catch(reject)
  })
}
