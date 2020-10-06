const getUrlProduction = process.env.NEXT_PUBLIC_URL_PRODUCTION
const baseUrl = process.env.NODE_ENV === 'production' ? getUrlProduction : "http://localhost:9000"
console.log("baseUrl",process.env.NODE_ENV,  getUrlProduction, process.env.test)
export default baseUrl