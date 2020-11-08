const getUrlProduction = process.env.production
const baseUrl = process.env.NODE_ENV === 'production' ? getUrlProduction : "http://localhost:9000"
console.log("baseUrl",process.env.NODE_ENV,  getUrlProduction)
export default baseUrl