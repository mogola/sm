const MongoClient = require('mongodb').MongoClient;
import initDB from '../../helpers/initDB'
import { db, database, getCollectionData, updatePostData} from '../../helpers/connectToMongo'
import mongoose from 'mongoose'
import AboutSchema from '../../models/About'

initDB()

export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getDataPost(req,res)
            break
        case "POST":
            await createPost(req, res)
            break
        case "PUT":
            await updatePost(req, res)
            break
        case "DELETE":
            await deletePost(req,res)
            break
    }
}

const getDataPost = async (req, res) => {
    try{
        const aboutconfig = await AboutSchema.find().sort({"_id": -1})

        res.json({
            "getConfig" : aboutconfig
        })

    }
    catch(err){
        console.log(err)
    }
}

const createPost = async (req, res) => {
    const {data} =  req.body
    console.log(data)
    try{
          if(!data){
              return res.status(422).json({error:"Please add all the fields"})
          }
     const getConfig = await new AboutSchema({
       _id: new mongoose.Types.ObjectId(),
      data
     }).save()
     res
     .status(201)
     .json(getConfig, {"success": true})
    }
    catch(err){
      res.status(500).json({error:"internal server error"})
      console.log(err)
    }
}

const deletePost = (req, res) => {
    res.json({message :"getAllCollection"})
}


const updatePost = async (req, res) => {
    const {data, collection, _id} = req.body
    console.log(data, collection, _id)
    updatePostData(res, data, _id)
    //     await AboutSchema.updateOne({ _id: _id }, data,
    //         function(err, updatePost){
    //             if(err) console.log(err)
    //             console.log("updateAbout", updatePost)
    //             res.json({
    //                 "aboutUpdate":updatePost
    //             })
    //     })
    // }
    // catch(err){
    //     console.log(err)
    // }

}