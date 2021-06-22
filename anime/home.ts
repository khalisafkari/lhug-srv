import cheerio from 'cheerio'
import { error } from '../utils/log'
import core from './url'

interface top {
    id: string;
    title: string;
    content: string;
    meta: {
        image:{
            url: string;
            alt: string;
        }
        views: string;
        rate: string
    }
}

interface latestepisode {
    episodeID: string;
    content: string;
    title: string;
    meta: {
        image: {
            url: string
            alt: string
        };
        views: string;
        rate: string;
        episodeTitle: string;
        episodeDate: {
            title: string
            date: string;
        },
        episodeVideo: string;
    }
}

interface content {
    list: Map<string, top[]>;
    latestanime: top[]
    latestepisode: latestepisode[]
}

const get = async () : Promise<content> => {
  try {
    const data = await core.get('/')
    const $ = cheerio.load(data.data)

    const list: Map<string, top[]> | any = {}

    $('.tab-content .tab-pane').each((index, element) => {
      list[`${$(element).attr('id')?.trim()}`] = $(element).find('#' + $(element).attr('id')?.trim() + ' ul li a').map((i, e) => ({
        id: $(e).attr('href')?.trim().replace('https://tenshi.moe/anime/', ''),
        title: $(e).find('.overlay span').text().trim(),
        content: $(e).attr('data-content')?.trim(),
        meta: {
          image: {
            url: $(e).find('img').attr('src')?.trim(),
            alt: $(e).find('img').attr('alt')?.trim()
          },
          views: $(e).find('.views').text().trim(),
          rate: $(e).find('.rating').text().trim()
        }
      })).get()
    })

    const latestanime = $('#content section:nth-child(3) ul li a').map((index, element) => ({
      id: $(element).attr('href')?.trim().replace('https://tenshi.moe/anime/', ''),
      title: $(element).find('.overlay span').text().trim(),
      content: $(element).attr('data-content')?.trim(),
      meta: {
        image: {
          url: $(element).find('img').attr('src')?.trim(),
          alt: $(element).find('img').attr('alt')?.trim()
        },
        views: $(element).find('.views').text().trim(),
        rate: $(element).find('.rating').text().trim()
      }
    })).get()

    const latestepisode = $('#content > section:nth-child(4) ul li a').map((index, element) => ({
      id: $(element).attr('href')?.trim().replace('https://tenshi.moe/anime/', '').replace(/\/[\d+]/gi, ''),
      content: $(element).attr('data-content')?.trim(),
      title: $(element).find('.overlay .title').text().trim(),
      meta: {
        image: {
          url: $(element).find('img').attr('src')?.trim(),
          alt: $(element).find('img').attr('alt')?.trim()
        },
        views: $(element).find('.views').text().trim(),
        rate: $(element).find('.rating').text().trim(),
        episodeTitle: $(element).find('.overlay .episode-title').text().trim(),
        episodeDate: {
          title: $(element).find('.overlay .episode-meta .episode-date').attr('title')?.trim(),
          date: $(element).find('.overlay .episode-meta .episode-date').text().trim()
        },
        episodeVideo: $(element).find('.overlay .episode-video').text().trim()
      }
    })).get()

    const results: content = {
      list,
      latestanime,
      latestepisode
    }
    error.info('success', {
      date: new Date(),
      route: 'home'
    })
    return results
  } catch (e) {
    error.error(`${e.toString()}`, {
      date: new Date(),
      route: 'home'
    })
    return e
  }
}

export default () : Promise<content> => {
  return new Promise((resolve, reject) => {
    get().then(resolve).catch(reject)
  })
}
