import initDB from '../../helpers/initDB'
import Category from '../../models/Category'
import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import mylogger from '../../helpers/mylogger';
import { db, database, getCollectionData } from '../../helpers/connectToMongo'
const handler = nextConnect();
handler.use(mylogger)

handler.get(async (req, res) => {
    try {
        const posts = await Category
            .find()
            .sort({ "_id": 1 })

        if (posts) {
            res.json(JSON.stringify(posts))
        } else {
            res.status(200).json([])
        }
    }
    catch (err) {
        console.log(err)
    }
})

handler.post(async (req, res) => {
    const { nameCategory } = req.body
    console.log("nameCateory", req.body)
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
})


handler.delete(async (req, res) => {
    try {
        await Homeconfig.remove({ _id: req.body.id })
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
    catch (err) {
        console.log('error during the process the deletion')
    }
})

handler.put(async (req, res) => {
    const { config } = req.body;
    console.log('category updating', req.body)
    try {
        await Category.updateMany({ _id: { $in: req.body.category } },
            { $push: { posts: req.body.id } },
            function (err, object) {
                if (err) {
                    console.log(err.message);  // returns error if no matching object found
                } else {
                    console.log(object);
                    res.json(object)
                }
            })
    }
    catch (err) {
        console.log('category updating', err)
    }
})

export default handler;