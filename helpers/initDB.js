import mongoose from 'mongoose'

let uri = process.env.MONGODB_URI
let dbName = process.env.MONGODB_DB

function initDB(){
    if(mongoose.connections[0].readyState){
        console.log("alredy connected")
        return
    }
    mongoose.connect(`${uri}${dbName}?retryWrites=true&w=majority`,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    mongoose.connection.on('connected',()=>{
        console.log("connected to mongo")
    })
    mongoose.connection.on('error',(err)=>{
        console.log("error connecting",err)
    })
}

//export const db = connect("mongodb+srv://heroku_ppkc1116:q2fjjm3d8g20be22kvifqkq5gr@cluster0.4wngo.mongodb.net/Portfolio?retryWrites=true&w=majority")
export default initDB