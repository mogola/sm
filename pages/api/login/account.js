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

        console.log(token)
        await RegisterModel.findOne({email: user.email})
        .then(account => {
            if(account !== null){
                res.setHeader('x-auth-token', token)
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