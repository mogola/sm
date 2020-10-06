const baseUrl = process.env.NODE_ENV === 'production' ? process.env.URL_PRODUCTION : "http://localhost:9000"
console.log("baseUrl", process.env.URL_PRODUCTION)
export default baseUrl