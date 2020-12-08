import initDB from '../../helpers/initDB'
import Homeconfig from '../../models/Homeconfig'
import RegisterModel from '../../models/RegisterModel'
import mongoose from 'mongoose'
const { decode } = require('../../helpers/jwt')

initDB()

export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getAllConfig(req,res)
            break
        case "POST":
            await saveConfig(req,res)
            break
        case "PUT":
            await updateConfig(req,res)
            break
        case "DELETE":
            await deleteConfig(req,res)
            break
    }
}


const getAllConfig = async (req,res)=>{
    try{
        let {headers} = req
        console.log("cookie headers", headers['cookie'])
        let getTokenUser;

        if(headers['cookie'] !== undefined){
            getTokenUser = req.headers['cookie'].split('token=')[1]
            console.log(decode(getTokenUser))
        }

        if(getTokenUser !== undefined || decode(getTokenUser) !== null){
            let {payload} = decode(getTokenUser)
        console.log('get req-header-x-auth', decode(getTokenUser))

        await RegisterModel.findOne({email: payload.email})
        .then(async (account) => {
            if(account.role !== "admin"){
                console.log('role :', account.role)
                res.status(300).json({"message": "not authorized"})
            }else {
                console.log(account)
                const posts = await Homeconfig
                .find()
                .sort({"_id": 1})

                if(posts){
                    res.json(JSON.stringify(posts[0]))
                }else{
                    res.status(200).json([])
                }
            }
        })
    }else{
        res.status(300).json({"message": "not authorized"})
    }
  }
  catch(err){
    console.log(err)
  }

}

const saveConfig = async (req,res)=>{
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
}


const deleteConfig = async (req,res)=>{
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
}

const updateConfig = async(req, res) => {
    const {config} = req.body;
    console.log('current post', config._id)
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
}