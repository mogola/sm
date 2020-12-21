import initDB from '../../helpers/initDB'
import Homeconfig from '../../models/Homeconfig'
import mongoose from 'mongoose'

initDB()

export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getAllConfig(req,res)
            break
    }
}


const getAllConfig = async (req,res) => {
    try{
        const posts =  await Homeconfig
        .find({})

        res.status(200).json(posts[0])
  }
  catch(err){
    console.log(err)
    res.send(err)
  }

}