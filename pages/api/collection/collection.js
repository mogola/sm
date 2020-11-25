const MongoClient = require('mongodb').MongoClient;
import { db } from '../../../helpers/connectToMongo'
//import 'mongoose' from mongoose
export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getAllCollection(req,res)
            break
        case "POST":
            await createCollection(req,res)
            break
        case "DELETE":
            await deleteCollection(req,res)
            break
    }
}

const getAllCollection = async (req, res) => {
    try{
        MongoClient
        .connect('mongodb+srv://heroku_ppkc1116:q2fjjm3d8g20be22kvifqkq5gr@cluster0.4wngo.mongodb.net/',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        async function(err, db) {
        var dbo = db.db("Portfolio");
            const dataCollections = await dbo.collections()
            let collectionList = []
            dataCollections.forEach((cols) => {
                console.log("collectionName", cols.collectionName)
                collectionList.push(cols.collectionName)
            })

            console.log(collectionList)
            res.json({data: collectionList})
            db.close();
        })
    }
    catch(err){
        console.log(err)
    }
}

const createCollection = async (req, res) => {
    try {
            let {name} = req.body
            console.log('typeof', typeof(name), name)
            db(name, req, res)

    }
    catch(err){
        console.log("error category name", err)
        res.json({
            message: err
        })
    }
}

const deleteCollection = (req, res) => {
    res.json({message :"getAllCollection"})
}