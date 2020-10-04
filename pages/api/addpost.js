// require Mongoose
import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
var mongoose = require('mongoose');

const handler = nextConnect();
handler.use(middleware);


handler.get(async (req, res) => {
    try {
        let doc = await req.db
        .collection('newhomepages')
        .find({})
        .sort({ metacritic: -1 })
        .limit(20)
        .toArray();

        res
            .json(doc);
    }
    catch(err){
        console.log(err)
    }
});

handler.post(async (req, res) => {
    const { title, urlImage } = req.body;

    if (!title) return res.status(400).send('You must write something');

    const post = {
      _id: mongoose.Types.ObjectId(),
      title: title,
      urlImage: urlImage,
    };

    await req.db.collection('newhomepages').insertOne(post);
    return res.send(post);
  });

export default handler
// export function addPost(){
//     console.log('test ajout');
// }

// export async function addPost(title, url) {

//     // const addPost = new Homepage({
//     //     _id : idObject,
//     //     title : title,
//     //     urlImage : url
//     // });
//     try {
//     let timestamp = Math.floor(new Date().getTime()/1000);
//     const idObject = new ObjectID(timestamp);

//        return await db
//         .collection("newhomepages")
//         .save(addPost)
//         .then((res) =>{
//             console.log(doc);
//             res.json(res);
//         }).catch((err) => {
//             console.log(err);
//             res.json(err);
//         })
//     }
//     catch(err){
//         console.log('error', err)
//     }
//     // addPost
//     //     .save()
//     //     .then((res) =>{
//     //         console.log(doc);
//     //         res.json(res);
//     //     }).catch((err) => {
//     //         console.log(err);
//     //         res.json(err);
//     //     })
// }
