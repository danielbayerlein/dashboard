import { Base64 } from 'js-base64'
import auth from '../auth'

export const base64BasicAuthHeader = (key) => {
  const credentials = auth[key]
  const credential = Base64.encode(`${credentials.username}:${credentials.password}`)
  return { 'Authorization': `Basic ${credential}` }
}
