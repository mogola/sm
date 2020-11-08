import initDB from '../../helpers/initDB'
import ProjectsSchema from '../../models/Projects'
import mongoose from 'mongoose'

initDB()

export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getAllProjects(req,res)
            break
    }
}


const getAllProjects = async (req,res)=>{
    try{
        const posts =  await ProjectsSchema
        .find({})

        res.status(200).json(posts)
  }
  catch(err){
    console.log("error", err)
  }

}