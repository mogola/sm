import initDB from '../../helpers/initDB'
import ProjectsSchema from '../../models/Projects'
import RegisterModel from '../../models/RegisterModel'
import Homeconfig from '../../models/Homeconfig'
import mongoose from 'mongoose'

initDB()

export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getAllPost(req,res)
            break
    }
}


const getAllPost = async (req,res) => {
  try {
    let number;

    if(number === "" || number === undefined){
      number = 40
    }

    const data = await ProjectsSchema
    .find({})
    .sort({ "_id":-1 })
    .limit(number)
    
      return res.json(data);
  }
  catch(err) {
    console.log(err)
  }
}