import initDB from '../../helpers/initDB'
import ProjectsSchema from '../../models/Projects'
import RegisterModel from '../../models/RegisterModel'
import Homeconfig from '../../models/Homeconfig'
import mongoose from 'mongoose'
const { decode } = require('../../helpers/jwt')

initDB()

export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getAllProjects(req,res)
            break
        case "POST":
            await saveProjects(req,res)
            break
        case "PUT":
            await updateProjects(req,res)
            break
        case "DELETE":
            await deleteProjects(req,res)
            break
    }
}


const getAllProjects = async (req,res)=>{
    try{

        let getTokenUser = req.headers['cookie'].split('token=')[1]

        console.log(decode(getTokenUser))
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

const saveProjects = async (req,res)=>{
  const {projects} =  req.body
  console.log(projects)
  try{
        if(!projects){
            return res.status(422).json({error:"Please add all the fields"})
        }
   const getProjects = await new ProjectsSchema({
     _id: new mongoose.Types.ObjectId(),
     projects
   }).save()
   res
   .status(201)
   .json(getProjects, {"success": true})
  }
  catch(err){
    res.status(500).json({error:"internal server error"})
    console.log(err)
  }
}


const deleteProjects = async (req,res)=>{
    try{
        await ProjectsSchema.remove({ _id: req.body.id })
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

const updateProjects = async(req, res) => {
    const {projects} = req.body;
    console.log('current post', projects)
    try {
        await ProjectsSchema.updateOne({ _id:projects._id},
            projects,
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