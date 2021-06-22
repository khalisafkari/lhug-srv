import Cheerio from 'cheerio'
import { convertNumber } from '../connector'
import { error } from '../utils/log'
import core from './url'

const get = async (page?: number) => {
  try {
    const data = await core.get(`/anime${page ? `?page=${page}` : ''}`, {
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
      route: 'anime'
    })
    throw new Error(e)
  }
}

export const AnimeDetail = async (id: string) => {
  if (!id) return { message: 'limit' }

  try {
    const data = await core.get(`/anime/${id}`)
    const $ = Cheerio.load(data.data)

    const meta = {
      image: {
        url: $('main article .entry-content .entry-info .side-info .cover-area img').attr('src')?.trim(),
        alt: $('main article .entry-content .entry-info .side-info .cover-area img').attr('title')?.trim()
      }
    }

    const sections = {
      offcial: {
        title: $('main article .entry-content .entry-info .main-info .info-list .official-title .info-box .value').map((index, element) => ({
          country: $(element).find('span').attr('title')?.trim(),
          title: $(element).text().trim()
        })).get()
      },
      synonym: $('main article .entry-content .entry-info .main-info .info-list .synonym .info-box .value').text().trim(),
      short: $('main article .entry-content .entry-info .main-info .info-list .short .info-box .value').text().trim(),
      genre: $('main article .entry-content .entry-info .main-info .info-list .genre .value a').map((index, element) => ({
        id: $(element).attr('href')?.trim().replace('https://tenshi.moe/genre/', ''),
        titlte: $(element).text().trim()
      })).get(),
      type: {
        id: $('main article .entry-content .entry-info .main-info .info-list .type .value a').attr('href')?.trim().replace('https://tenshi.moe/type/', ''),
        title: $('main article .entry-content .entry-info .main-info .info-list .type .value a').text()?.trim().replace('https://tenshi.moe/type/', '')
      },
      status: {
        id: $('main article .entry-content .entry-info .main-info .info-list .status .value a').attr('href')?.trim().replace('https://tenshi.moe/status/', ''),
        title: $('main article .entry-content .entry-info .main-info .info-list .status .value a').text()?.trim()
      },
      'release-date': {
        id: $('main article .entry-content .entry-info .main-info .info-list .release-date .value').attr('title')?.trim(),
        title: $('main article .entry-content .entry-info .main-info .info-list .release-date .value').text()?.trim()
      },
      views: convertNumber($('main article .entry-content .entry-info .main-info .info-list .views .value').text()?.trim()),
      'content-rating': {
        id: $('main article .entry-content .entry-info .main-info .info-list .content-rating .value a').attr('href')?.trim().replace('https://tenshi.moe/content-rating/', ''),
        title: $('main article .entry-content .entry-info .main-info .info-list .content-rating .value a').text()?.trim()
      },
      production: $('main article .entry-content .entry-info .main-info .info-list .production .value a').map((index, element) => ({
        id: $(element).attr('href')?.trim().replace('https://tenshi.moe/production/', ''),
        title: $(element).text().trim()
      })).get(),
      source: $('main article .entry-content .entry-info .main-info .info-list .source .value a').map((index, element) => ({
        id: $(element).attr('href')?.trim().replace('https://tenshi.moe/source/', ''),
        title: $(element).text().trim()
      })).get(),
      resolution: $('main article .entry-content .entry-info .main-info .info-list .resolution .value a').map((index, element) => ({
        id: $(element).attr('href')?.trim().replace('https://tenshi.moe/resolution/', ''),
        title: $(element).text().trim()
      })).get(),
      group: {
        id: $('main article .entry-content .entry-info .main-info .info-list .group .value a').attr('href')?.trim().replace('https://tenshi.moe/group/', ''),
        title: $('main article .entry-content .entry-info .main-info .info-list .group .value a').text().trim()
      },
      audio: {
        id: $('main article .entry-content .entry-info .main-info .info-list .audio a').attr('href')?.trim().replace('https://tenshi.moe/anime?q=', ''),
        title: $('main article .entry-content .entry-info .main-info .info-list .audio a').attr('title')?.trim()
      },
      subtitle: {
        id: $('main article .entry-content .entry-info .main-info .info-list .subtitle a').attr('href')?.trim().replace('https://tenshi.moe/anime?q=', ''),
        title: $('main article .entry-content .entry-info .main-info .info-list .subtitle a').attr('title')?.trim()
      },
      description: $('main article .entry-content .entry-description .card-body').text()?.trim()
    }

    const similar = $('#entry-similar ul li a').map((index, element) => ({
      id: $(element).attr('href')?.trim().replace('https://tenshi.moe/anime/', ''),
      title: $(element).attr('data-original-title')?.trim(),
      meta: {
        image: {
          alt: $(element).find('img').attr('alt')?.trim(),
          url: $(element).find('img').attr('src')?.trim()
        }
      },
      views: $(element).find('.views').text().trim(),
      rate: $(element).find('.rating').text().trim(),
      overlay: $(element).find('.overlay span').text().trim()
    })).get()

    return {
      title: $('main article header h1').text().trim(),
      meta,
      ...sections,
      similar,
      message: 'success'
    }
  } catch (e) {
    error.error(`${e.toString()}`, {
      date: new Date(),
      route: 'anime detail'
    })
    throw new Error(e)
  }
}

export const AnimeEpisode = async (id: string) => {
  if (!id) return { message: 'limit' }

  try {
    const data = await core.get(`/anime/${id}/1`)
    const $ = Cheerio.load(data.data)
    const list = $('.playlist-episodes li a').map((index, element) => ({
      id: $(element).attr('href')?.trim(),
      title: $(element).attr('title')?.trim(),
      meta: {
        image: {
          alt: $(element).find('.eps_cvr img').attr('alt')?.trim(),
          url: $(element).find('.eps_cvr img').attr('src')?.trim()
        }
      },
      date: $(element).find('.eps_dte').text().trim()
    })).get()

    return {
      list,
      total: list.length,
      message: 'success'
    }
  } catch (e) {
    error.error(`${e.toString()}`, {
      date: new Date(),
      route: 'anime episode'
    })
    throw new Error(e)
  }
}

export default (page?:number) => {
  return new Promise((resolve, reject) => {
    get(page).then(resolve).catch(reject)
  })
}
