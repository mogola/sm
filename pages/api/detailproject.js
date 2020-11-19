import initDB from '../../helpers/initDB'
import ProjectsSchema from '../../models/Projects'
import RegisterModel from '../../models/RegisterModel'
import Homeconfig from '../../models/Homeconfig'
import mongoose from 'mongoose'
import { projectConfig } from 'services/jsonProjects'
const { decode } = require('../../helpers/jwt')

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
                .find()
                .sort({"_id": 1})

      if(posts){
          res.json(JSON.stringify(posts))
      }else{
          res.status(200).json([])
      }
  }
  catch(err){
    console.log(err)
  }
}
