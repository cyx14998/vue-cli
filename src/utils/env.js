const path = '/databrowser-api'
const baseUrl = process.env.NODE_ENV !== 'production' ? path : 'https://client.mysteel.com' + path
export default baseUrl