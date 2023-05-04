import mongoose from 'mongoose'

let uri_prod = process.env.MONGODB_URI
let dbName_prod = process.env.MONGODB_DB
let uri_dev = process.env.MONGODB_URI_DEV
let dbName_dev= process.env.MONGODB_DB_DEV
let env = process.env.environment;
let uri = env === "developement" ? uri_dev : uri_prod;
let dbName = env === "developement" ? dbName_dev : dbName_prod;

function initDB(){
    if(mongoose.connections[0].readyState){
        console.log("alredy connected")
        return
    }
    mongoose.connect(`${uri}${dbName}`,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
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