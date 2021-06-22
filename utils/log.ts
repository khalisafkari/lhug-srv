import { createLogger, transports } from 'winston'
import Rotate from 'winston-daily-rotate-file'

const console = createLogger({
  transports: [new transports.Console()]
})

console.configure({
  level: 'verbose',
  transports: [
    new Rotate({
      filename: 'success-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '30d',
      dirname: './log',
      utc: true
    })
  ]
})

export const error = createLogger({
  transports: [
    new transports.Console(),
    new Rotate({
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '30d',
      dirname: './log',
      utc: true
    })
  ],
  level: 'verbose'
})

export default console
