import nextConnect from 'next-connect'
import mylogger from '../../helpers/mylogger';
const handler = nextConnect();

handler.use(mylogger)

handler.get((req, res) => {
    res.json("message", "ok")
})

export default handler;