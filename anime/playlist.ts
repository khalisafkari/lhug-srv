import Cheerio from 'cheerio'
import { convertNumber } from '../connector'
import { error } from '../utils/log'
import core from './url'

const get = async (page?: number) => {
  try {
    const data = await core.get(`/playlist${page ? `?page=${page}` : ''}`, {
      withCredentials: true,
      headers: {
        Cookie: 'loop-view=thumb;'
      }
    })
    const $ = Cheerio.load(data.data)
    const list = $('main .loop li .playlist').map((index, elemenet) => ({
      id: $(elemenet).find('a').attr('href')?.trim().replace('https://tenshi.moe/playlist/', '').replace('/1', ''),
      title: $(elemenet).find('.playlist-detail a').text().trim(),
      meta: {
        image: {
          alt: $(elemenet).find('a img').attr('alt'),
          url: $(elemenet).find('a img').attr('src')
        }
      },
      admin: {
        name: $(elemenet).find('.playlist-detail .admin a').text(),
        url: $(elemenet).find('.playlist-detail .admin a').attr('href')
      },
      info: {
        count: $(elemenet).find('.playlist-detail .playlist-info .playlist-video-count').text(),
        date: $(elemenet).find('.playlist-detail .playlist-info .playlist-last-update').text()
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
      route: 'playlist'
    })
    return e
  }
}

export const playListId = async (id: string) => {
  if (!id) {
    return {
      message: 'limit'
    }
  }

  try {
    const data = await core.get(`/playlist/${id}/1`)
    const $ = Cheerio.load(data.data)
    const list = $('.playlist-items li a').map((index, element) => ({
      id: $(element).attr('href')?.trim(),
      idx: $(element).find('.idx').text().trim(),
      meta: {
        image: {
          alt: $(element).find('.cvr img').attr('alt'),
          url: $(element).find('.cvr img').attr('src')
        }
      },
      dtl: {
        tt: $(element).find('.dtl .vdo_ttl_anm').text().trim(),
        eps: $(element).find('.dtl .vdo_ttl_eps').text().trim()
      },
      mta: {
        type: $(element).find('.mta span:nth-child(1)').text().trim(),
        audio: $(element).find('.mta span:nth-child(2) span').attr('title')?.trim().replace('Audio: ', ''),
        subtitle: $(element).find('.mta span:nth-child(3) span').attr('title')?.trim().replace('Subtitle: ', '')
      }
    })).get()

    return {
      list,
      message: 'success'
    }
  } catch (e) {
    error.error(`${e.toString()}`, {
      date: new Date(),
      route: 'playlist_id'
    })
    return e
  }
}

export default (page?:number) => {
  return new Promise((resolve, reject) => {
    get(page).then(resolve).catch(reject)
  })
}
