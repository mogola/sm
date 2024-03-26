import initDB from '../../helpers/initDB'
import HomeConfigSchema from '../../models/Homeconfig'
import RegisterModel from '../../models/RegisterModel'
import mongoose from 'mongoose'

initDB()

export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getAllData(req,res)
            break
    }
}


const getAllData = async (req,res) => {
  try {
    const data = await HomeConfigSchema
      .find({})
      .sort({ "_id":1 })
      .limit(20)
    
      return res.json(data);
  }
  catch(err) {
    console.log(err)
  }
}