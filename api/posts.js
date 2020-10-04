import initDB from '../../helpers/initDB'
import Homepage from '../../models/Homepage'
import mongoose from 'mongoose'

initDB()

export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getAllPost(req,res)
            break
        case "POST":
            await savePost(req,res)
            break
        case "PUT":
            await updatePost(req,res)
            break
        case "DELETE":
            await deletePost(req,res)
            break
    }
}


const getAllPost = async (req,res)=>{
    try{
        const posts =  await Homepage
        .find()
        .sort({"_id": -1})

        res.status(200).json(posts)
  }
  catch(err){
    console.log(err)
  }

}

const savePost = async (req,res)=>{
  const {title, urlImage, linkImage} =  req.body
  try{
        if(!title || !urlImage || !linkImage){
            return res.status(422).json({error:"Please add all the fields"})
        }
   const post = await new Homepage({
     _id: new mongoose.Types.ObjectId(),
     title: title,
     urlImage: urlImage,
     linkImage: linkImage
   }).save()
   res
   .status(201)
   .json(post, {"success": true})
  }
  catch(err){
    res.status(500).json({error:"internal server error"})
    console.log(err)
  }
}


const deletePost = async (req,res)=>{
    try{
        await Homepage.remove({ _id: req.body.id })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
            message: "post deleted"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
            })
        })
    }
    catch(err){
        console.log('error during the process the deletion')
    }
}

const updatePost = async(req, res) => {
    const { _id, title, urlImage } = req.body;
    console.log('current post', req.body)
    try {
        await Homepage.updateOne({ _id: _id},
            {title: title, urlImage: urlImage},
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