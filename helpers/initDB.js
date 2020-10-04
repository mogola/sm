import mongoose from 'mongoose'

let uri = process.env.MONGODB_URI
let dbName = process.env.MONGODB_DB

function initDB(){
    if(mongoose.connections[0].readyState){
        console.log("alredy connected")
        return
    }
    mongoose.connect(uri,{
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

export default initDB