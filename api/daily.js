// require Mongoose
import nextConnect from 'next-connect';
import middleware from '../middleware/database';

const handler = nextConnect();
handler.use(middleware);


handler.get(async (req, res) => {
    try {
        let doc = await req.db.collection('homepage').findOne()

        res
            .json(doc);
    }
    catch(err){
        console.log(err)
    }
});

export default handler