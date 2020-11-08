import Homepage from '../../../models/Homepage'
import initDB from '../../../helpers/initDB'

initDB()

export default async (req,res)=>{
    switch(req.method){
        case "GET":
          await getPost(req,res)
          break;
        case "DELETE":
          await deletePost(req,res)
          break;
    }

}


const getPost = async (req,res)=>{
    const {pid} =  req.query
     const post = await Homepage.findOne({_id:pid})
     res.status(200).json(post)
}

const deletePost = async (req,res)=>{
    const {pid } =  req.query
    await Product.findByIdAndDelete({_id:pid})
    res.status(200).json({})
}

export const config = {
  api: {
    externalResolver: true,
  },
}