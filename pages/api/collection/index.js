import initDB, {db} from '../../../helpers/initDB'
var MongoClient = require('mongodb').MongoClient;

// const db = async (name, dbreq, dbres) => {
//     await MongoClient
//     .connect('mongodb+srv://heroku_ppkc1116:q2fjjm3d8g20be22kvifqkq5gr@cluster0.4wngo.mongodb.net/',
//     {
//      useNewUrlParser: true,
//      useUnifiedTopology: true,
//    },
//    async function(err, db) {
//      if(name !== undefined && name !== ''){
//          if (err) throw err;
//          var dbo = db.db("Portfolio");
//          await dbo.createCollection(name, async function(err, res) {
//              if (err) console.log(err.codeName);
//              if(err.code === 48) {
//                  console.log("Collection created!");
//                  const dataCollections = await dbo.collections()
//                  dataCollections.forEach((cols) => {
//                      console.log("collectionName", cols.collectionName)
//                  })

//                  let dataReturn = {
//                      message: err.codeName,
//                      collectionAlreadyExisting: name
//                  }

//                  dbres.json(dataReturn)
//              }else{
//                  let dataReturn = {
//                      collectionNameCreated: name
//                  }

//                  new Promise((resolve) => {
//                      resolve(dataReturn)
//                  })
//              }

//              db.close();
//          });
//      }
//      });
//  }

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
    await
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