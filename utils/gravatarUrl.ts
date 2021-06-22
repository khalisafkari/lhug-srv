import { URL, URLSearchParams } from 'url'
import crypto from 'crypto'

export default function gravatarUrl (identifier: string, options:any) {
  if (!identifier) {
    throw new Error('Please specify an identifier, such as an email address')
  }

  if (identifier.includes('@')) {
    identifier = identifier.toLowerCase().trim()
  }

  const baseUrl: any = new URL('https://gravatar.com/avatar/')
  baseUrl.pathname += crypto.createHash('md5').update(identifier).digest('hex')
  baseUrl.search = new URLSearchParams(options)

  return baseUrl.toString()
}
