import initDB from '../../helpers/initDB'
import Category from '../../models/Category'
import mongoose from 'mongoose'
var mongodb = require("mongodb")
var ObjectID = mongodb.ObjectID

initDB()

export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getAllCategorie(req,res)
            break
        case "POST":
            await saveCategorie(req,res)
            break
        case "PUT":
            await updateCategorie(req,res)
            break
        case "DELETE":
            await deleteCategorie(req,res)
            break
    }
}


const getAllCategorie = async (req,res)=>{
    try {
        const posts = await Category
            .find()
            .sort({ "_id": 1 })
            .populate({path:'posts'}).exec()

        if (posts) {
            res.json(JSON.stringify(posts))
        } else {
            res.status(200).json([])
        }
    }
    catch (err) {
        console.log(err)
    }
}

const saveCategorie = async (req,res)=>{
    const { nameCategory, idExclude } = req.body
    console.log("nameCateory", req.body, idExclude)

    try {
        if (!nameCategory) {
            return res.status(422).json({ error: "Please add all the fields" })
        }

        let postCategory = await new Category({
            _id: new mongoose.Types.ObjectId(),
            nameCategory
        }).save()

        res
            .status(201)
            .json(postCategory, { "success": true })
    }
    catch (err) {
        res.status(500).json({ error: "internal server error" })
        console.log(err)
    }
}


const deleteCategorie = async (req,res)=>{
    try{
        await Category.remove({ _id: req.body.id })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
            message: "Categorie deleted"
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

const updateCategorie = async(req, res) => {
    const { _id, title, urlImage } = req.body;
    console.log('current Categorie', req.body)
    try {
        await Category.updateOne({ _id: _id},
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