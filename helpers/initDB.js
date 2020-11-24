import mongoose from 'mongoose'
var MongoClient = require('mongodb').MongoClient;

let uri = process.env.MONGODB_URI
let dbName = process.env.MONGODB_DB

function initDB(){
    if(mongoose.connections[0].readyState){
        console.log("alredy connected")
        return
    }
    mongoose.connect(uri,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    mongoose.connection.on('connected',()=>{
        console.log("connected to mongo")
    })
    mongoose.connection.on('error',(err)=>{
        console.log("error connecting",err)
    })
}


export async function db(name, dbreq, dbres){
    try{
        await MongoClient
        .connect('mongodb+srv://heroku_ppkc1116:q2fjjm3d8g20be22kvifqkq5gr@cluster0.4wngo.mongodb.net/',
        {
         useNewUrlParser: true,
         useUnifiedTopology: true,
       },
       async function(err, db) {
         if(name !== undefined && name !== ''){
             if (err) throw err;
             var dbo = db.db("Portfolio");
             await dbo.createCollection(name, async function(err, res) {
                 if (err) console.log("err",err);
                 if(err && err.code === 48) {
                     console.log("Collection created!");
                     const dataCollections = await dbo.collections()
                     dataCollections.forEach((cols) => {
                         console.log("collectionName", cols.collectionName)
                     })

                     let dataReturn = {
                         message: err.codeName,
                         collectionAlreadyExisting: name,
                         collectionExist: true
                     }

                    return dbres.json(dataReturn)
                 }
                 else if(!err){
                    let dataReturn = {
                        collectionExist: false
                    }

                    return dbres.json(dataReturn)
                 }

                 db.close();
             });
         }
         });
    }
    catch(err){
        console.log(err)
    }
}



export async function getCollectionCreated(dbres){
    try{

        await MongoClient
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
            return new Promise((resolve, reject) => {
                resolve(collectionList)

                db.close();
            })

       })
    }
    catch(err){
        console.log(err)
    }
}

//export const db = connect("mongodb+srv://heroku_ppkc1116:q2fjjm3d8g20be22kvifqkq5gr@cluster0.4wngo.mongodb.net/Portfolio?retryWrites=true&w=majority")
export default initDB