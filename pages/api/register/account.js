import initDB from '../../../helpers/initDB'
import RegisterModel from '../../../models/RegisterModel'
import mongoose from 'mongoose'
const { sign, verify, decode } = require('../../../helpers/jwt')

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


        const token = sign({email: user.email}, user)

        const createUser = await new RegisterModel({
            _id: new mongoose.Types.ObjectId(),
            email: user.email,
            password: user.password,
            newpassword: user.newpassword
        }).save()

        console.log("token", token)
        res.setHeader('x-auth-token', token)

        res
        .status(201)
        .json({
            "user": createUser,
            "success": true,
            "token": token
        })
    }
    catch(err){
        if(err.code === 11000){
            res.status(409).json({
                code: err.code,
                message: "user already created"
            })
            console.log(err.code)
        }else{
            res.status(500).json({message: "user already created"})
            console.log(err.message)
        }
    }
}