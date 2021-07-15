import express, { Application, NextFunction, Request, Response } from 'express'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { Anime, Manga, Auth } from './route'
import dotnev from 'dotenv'
import expWiston from 'express-winston'
import Rotate from 'winston-daily-rotate-file'
import winston from 'winston'
dotnev.config()

const PORT: number = 3002

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
