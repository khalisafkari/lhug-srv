import axios from 'axios'

const core = axios.create({
  baseURL: 'https://tenshi.moe'
})

export const cancel = axios.CancelToken.source()

export default core
