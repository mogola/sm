import initDB from '../../../helpers/initDB'
import RegisterModel from '../../../models/RegisterModel'
import mongoose from 'mongoose'

initDB()

export default async (req,res)=>{
    switch(req.method){
        case "POST":
          await createUser(req,res)
          break;
    }
}

const createUser = async (req, res) => {
    const user =  req.body
    try{
        if(!user){
            return res.status(422).json({error:"Please add all the fields"})
        }

        const createUser = await new RegisterModel({
            _id: new mongoose.Types.ObjectId(),
            email: user.email,
            password: user.password,
            newpassword: user.newpassword
        }).save()

        res
        .status(201)
        .json(createUser, {"success": true})
    }
    catch(err){
      res.status(500).json({error:"internal server error"})
      console.log(err)
    }
}