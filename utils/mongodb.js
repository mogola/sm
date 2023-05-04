import { MongoClient } from 'mongodb'

let uri_prod = process.env.MONGODB_URI
let dbName_prod = process.env.MONGODB_DB
let uri_dev = process.env.MONGODB_URI_DEV
let dbName_dev= process.env.MONGODB_DB_DEV
let env = process.env.environment;
let uri = env === "developement" ? uri_dev : uri_prod;
let dbName = env === "developement" ? dbName_dev : dbName_prod;


console.log(process.env.environment);
let cachedClient = null
let cachedDb = null

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!dbName) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  console.log("connecte into", uri, 'and db name is', dbName);
  const client = await MongoClient.connect(`${uri}${dbName}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = await client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}