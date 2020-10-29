import initDB from '../../../helpers/initDB'
import RegisterModel from '../../../models/RegisterModel'

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
    try{
        if(!_id){
            return res.status(422).json({error:"Please add all the fields"})
        }
        console.log('current post', req.body)
        await RegisterModel.updateOne({ _id: _id},
            {role: role},
            function(err, object) {
                if (err){
                    console.log(err.message);  // returns error if no matching object found
                }else{
                    console.log(object);
                    res.json(object)
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