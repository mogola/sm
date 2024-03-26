const getUrlProduction = process.env.production
const baseUrl = process.env.NODE_ENV === 'production' ? getUrlProduction : "http://localhost:8500"
console.log
("url ===>",baseUrl)
export default baseUrl
