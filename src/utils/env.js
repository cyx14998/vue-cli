const path = '/databrowser-api'
const baseUrl = process.env.NODE_ENV !== 'development' ? 'https://client.mysteel.com' + path : path
export default baseUrl