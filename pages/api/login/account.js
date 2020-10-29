import initDB from '../../../helpers/initDB'
import RegisterModel from '../../../models/RegisterModel'
const { sign, verify, decode } = require('../../../helpers/jwt')

initDB()

export default async (req,res)=>{
    switch(req.method){
        case "POST":
          await loginUser(req,res)
          break;
    }
}

const loginUser = async (req, res) => {
    const user =  req.body
    try{
        if(!user){
            return res.status(422).json({error:"Please add all the fields"})
        }


        const token = sign({email: user.email}, user)

        // const createUser = await new RegisterModel({
        //     _id: new mongoose.Types.ObjectId(),
        //     email: user.email,
        //     password: user.password,
        //     newpassword: user.newpassword
        // }).save()

        await RegisterModel.findOne({email: user.email})
        .then(account => {
            if(account !== null){
                res.status(200).json({
                    "message" : "user exist",
                    "account" : account,
                    "token" : token,
                    "success" : true
                })
            }else{
                res.status(200).json({
                    "message": "user dont exist",
                    "account": account,
                    "success": false
                })
            }
        })

        // console.log("token", token)
        // res.setHeader('x-auth-token', token)

        // res
        // .status(201)
        // .json({
        //     "user": createUser,
        //     "success": true,
        //     "token": token
        // })
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