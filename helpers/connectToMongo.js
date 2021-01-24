const MongoClient = require('mongodb').MongoClient;
import AboutSchema from './../models/About'
let uri = process.env.MONGODB_URI
let dbName = process.env.MONGODB_DB

function database(obj, collection){
    try{
       const dbo =  MongoClient
        .connect('mongodb+srv://heroku_ppkc1116:q2fjjm3d8g20be22kvifqkq5gr@cluster0.4wngo.mongodb.net/',
        {
         useNewUrlParser: true,
         useUnifiedTopology: true,
       },
       async function(err, db) {
            const dbo = db.db("Portfolio");
            dbo.collection(collection).insertOne(obj, function(err, res){
                if (err) throw err;
                    console.log("1 document inserted");
                db.close();
            })
        })
    }
    catch(err){
        console.log(error)
    }
}

function db(name, dbreq, dbres){
    try{
     MongoClient
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

                    // dbo.collection("About").insertOne({
                    //     "title" : "example",
                    //     "content": "example 1",
                    //     "urlImage": "urlImage"
                    // }, function(err, res){
                    //     if (err) throw err;
                    //         console.log("1 document inserted");
                    //     db.close();
                    // })

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



function getCollectionCreated(dbres){
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

function getCollectionData(collection, res){
    try{
       MongoClient
        .connect('mongodb+srv://heroku_ppkc1116:q2fjjm3d8g20be22kvifqkq5gr@cluster0.4wngo.mongodb.net/',
        {
         useNewUrlParser: true,
         useUnifiedTopology: true,
       },
       async function(err, db) {
            const dbo = db.db("Portfolio");
            const data = await dbo.collection(collection).findOne()
            res.json({
                data
            })
            db.close();
        })
    }
    catch(err){
        console.log(error)
    }
}

const updatePostData = async (res, data, id) => {
    try{
       await AboutSchema.updateOne(
            { _id: id },
            data,
        function(err, updatePost){
            if(err) console.log(err)
            console.log("updateAbout", updatePost)
            res.json({
                "aboutUpdate":updatePost
            })
        })
    }
    catch(err){
        console.log(error)
    }
}

//export const db = connect("mongodb+srv://heroku_ppkc1116:q2fjjm3d8g20be22kvifqkq5gr@cluster0.4wngo.mongodb.net/Portfolio?retryWrites=true&w=majority")
export {
    db,
    getCollectionCreated,
    database,
    getCollectionData,
    updatePostData
}