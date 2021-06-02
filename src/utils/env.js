const path = '/databrowser-api'
const baseUrl = process.env.NODE_ENV !== 'development' ? 'https://crmdc.mysteelcms.com/' + path : path
export default baseUrl