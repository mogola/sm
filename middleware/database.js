import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

let uri = process.env.MONGODB_URI
let dbName = process.env.MONGODB_DB

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
    try {
        if (!client.isConnected()) await client.connect();
        req.dbClient = client;
        req.db = client.db(dbName);
        return next();
    }
    catch(err){
        console.log('eerrrreur', err);
    }
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;