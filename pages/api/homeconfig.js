import initDB from '../../helpers/initDB'
import Homeconfig from '../../models/Homeconfig'
import RegisterModel from '../../models/RegisterModel'
import mongoose from 'mongoose'
const { decode } = require('../../helpers/jwt')
import nextConnect from 'next-connect'
import mylogger from '../../helpers/mylogger';
const handler = nextConnect();
handler.use(mylogger)

initDB()

// export default async (req,res)=>{
//   switch (req.method)
//     {
//         case "GET":
//             await getAllConfig(req,res)
//             break
//         case "POST":
//             await saveConfig(req,res)
//             break
//         case "PUT":
//             await updateConfig(req,res)
//             break
//         case "DELETE":
//             await deleteConfig(req,res)
//             break
//     }
// }


handler.get(async (req, res) => {
    try{
    const posts = await Homeconfig
    .find()
    .sort({"_id": 1})

    if(posts){
        res.json(JSON.stringify(posts[0]))
    }else{
        res.status(200).json([])
    }
  }
  catch(err){
    console.log(err)
  }
})

handler.post(async (req, res) => {
  const {config} =  req.body
  console.log(config)
  try{
        if(!config){
            return res.status(422).json({error:"Please add all the fields"})
        }
   const getConfig = await new Homeconfig({
     _id: new mongoose.Types.ObjectId(),
    config
   }).save()
   res
   .status(201)
   .json(getConfig, {"success": true})
  }
  catch(err){
    res.status(500).json({error:"internal server error"})
    console.log(err)
  }
})


handler.delete(async (req, res) => {
    try{
        await Homeconfig.remove({ _id: req.body.id })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
            message: "post deleted"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
            })
        })
    }
    catch(err){
        console.log('error during the process the deletion')
    }
})

handler.put(async (req, res) => {
    const {config} = req.body;
    console.log('current post', config._id)
    config.__v++
    try {
        await Homeconfig.updateOne({ _id:config._id},
            config,
            function(err, object) {
                if (err){
                    console.log(err.message);  // returns error if no matching object found
                }else{
                    console.log(object);
                    res.json(object)
                }
            })
    }
    catch (err) {
        console.log('no registration', err)
    }
})

export default handler;