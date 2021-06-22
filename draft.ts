import express, { Application, NextFunction, Request, Response } from 'express'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { Anime, Manga, Auth } from './route'
import Zip from 'adm-zip'
import nodeFetch from 'node-fetch'
import dotnev from 'dotenv'
import expWiston from 'express-winston'
import Rotate from 'winston-daily-rotate-file'
import winston from 'winston'
dotnev.config()

// import crypto from 'crypto-js'

// console.log(crypto.AES.decrypt('U2FsdGVkX188h7SMyNJ8Dgce7L3iGRuo1DwGiHBtX+Nv8R8jZm9nsfrOce0KnSNSjJC/Ri3bY9UeDxKabc611w==', '267041df55ca2b36f2e322d05ee2c9cf').toString(crypto.enc.Utf8).trim()
// )
const PORT: number = 3000

// (async () => {

// })()

const app: Application = express()

Sentry.init({
  dsn: 'https://9c8dac407eb44c36ade2f2be28034d5e@o121589.ingest.sentry.io/5825606',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.use(expWiston.logger({
  transports: [
    new winston.transports.Console(),
    new Rotate({
      filename: 'log-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '10d',
      dirname: './log',
      utc: true
    })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: false,
  msg: 'HTTP {{req.method}} {{res.responseTime}}ms {{req.url}}',
  expressFormat: false,
  colorize: true,
  ignoreRoute: function (req, res) { return false }
}))

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.headers.token === process.env.SECURE_TOKEN) {
    next()
    return
  }
  return res.status(403).send({
    message: 'forbidden',
    require: 'serial_key',
    code: 403
  })
})

app.get('/zip', async (req, res) => {
  const list = ['https://s4.ihlv1.xyz/images2/20210604/01_60ba06b51ce0f.jpg', 'https://s4.ihlv1.xyz/images2/20210604/01_60ba06b51ce0f.jpg']

  const adm = new Zip()
  for (let i = 0; i < list.length; i++) {
    const request = await nodeFetch(list[i], {
      headers: {
        referer: 'https://lovehug.net'
      }
    }).then((res) => res.buffer())
    adm.addFile(`${i}.png`, request)
  }
  const content = adm.toBuffer()
  return res.end(content)
})

app.use('/anime', Anime)
app.use('/manga', Manga)
app.use('/auth', Auth)

app.use(Sentry.Handlers.errorHandler())

app.use('*', (req: Request, res: Response) => {
  const timerStart = Date.now()
  return res.send({
    message: 'success',
    time: Date.now() - timerStart,
    code: 201
  })
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})
