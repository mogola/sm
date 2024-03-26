const MongoClient = require('mongodb').MongoClient;
import { db, database, getCollectionData } from '../../helpers/connectToMongo'
//import 'mongoose' from mongoose
export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getDataPage(req,res)
            break
        case "POST":
            await createPage(req,res)
            break
        case "PUT":
            await updatePage(req, res)
            break
        case "DELETE":
            await deletePage(req,res)
            break
    }
}

const getDataPage = async (req, res) => {
    try{
        const dataAbout =  await getCollectionData("abouts",res);
        const getContact = dataAbout.json();
        
        res.json(getContact);
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
}

const createPage = async (req, res) => {
    try {
            let {name} = req.body
            console.log('typeof', typeof(name), name)
            db(name, req, res)

    }
    catch(err){
        console.log("error category name", err)
        res.json({
            message: err
        })
    }
}

const deletePage = (req, res) => {
    res.json({message :"getAllCollection"})
}


const updatePage = async (req, res) => {
    const {obj, nameCollection, multiple} = req.body
    const {fieldProp, valueProp} = obj
    let objArr;
    if(multiple !== true){
        objArr = {[fieldProp]: valueProp}
    }else {
        objArr = obj
    }
    console.log(req.body, typeof nameCollection)
    try{
        await database(objArr, nameCollection)
    }
    catch(err){
        console.log(err)
    }
}