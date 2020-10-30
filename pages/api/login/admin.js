import initDB from '../../../helpers/initDB'
import RegisterModel from '../../../models/RegisterModel'
import Homeconfig from '../../../models/Homeconfig'

initDB()

export default async (req,res)=>{
    switch(req.method){
        case "POST":
            await loginUpdate(req,res)
            break;
        case "GET":
            await getAllUser(req,res)
            break;
    }
}

const loginUpdate = async (req, res) => {
    const {_id, role} =  req.body
    let userUpdateObject = req.body
    let getIdConfig;
    let user;
    let updateRole;

    try{
        if(!_id){
            return res.status(422).json({error:"Please add all the fields"})
        }
       // console.log('current post', req.body)
       if(role === "admin"){
            getIdConfig = await Homeconfig
            .find()
            .sort({"_id": 1})

            user = {...userUpdateObject, config: getIdConfig[0]._id}
            updateRole = {role : user.role, config: user.config}
            console.log('admin', updateRole)
        }else{
            user = {...userUpdateObject}
            updateRole = {role : user.role}
            console.log('user', updateRole)
        }

        await RegisterModel.updateOne({ _id: _id},
            updateRole, function(err, object) {
                if (err){
                    console.log(err.message);  // returns error if no matching object found
                }else{
                    let currentUser = RegisterModel
                    .findOne({ _id: _id})
                    .populate('config')
                    .then(user => res.json({"user":user}))
                    console.log(currentUser);
                }
            })
    }
    catch (err) {
        console.log('no registration', err)
    }
}

const getAllUser =  async (req,res)=>{
    try{
       const user = await RegisterModel
       .find()
       .sort({"_id": -1})

       res.json(user)
  }
  catch(err){
    console.log(err)
  }

}