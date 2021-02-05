import Homeconfig from '../models/Homeconfig'
import RegisterModel from '../models/RegisterModel'
const { decode } = require('../helpers/jwt')

const mylogger = async (req, res, next) => {
    let {headers} = req
    let getTokenUser;

    console.log("headers response,", headers['cookie'])
    if(headers['cookie'] !== undefined){
        getTokenUser = req.headers['cookie'].split('token=')[1]
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
                    console.log("user connected with", account.email)
                    req.email = account.email
                    next()
                }
            })
        }
    } else {
        res.json({
            "message" : "vous n'etes pas connecté"
        })
    }
}

export default mylogger