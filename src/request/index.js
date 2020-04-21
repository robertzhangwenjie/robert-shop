import axios from 'axios'

const baseURL = process.env.VUE_APP_URL
const request = axios.create({
  baseURL,
  timeOut: 1000 * 12
})

export default request
