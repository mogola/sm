import initDB from '../../helpers/initDB'
import ProjectsSchema from '../../models/Projects'

initDB()

export default async (req,res)=>{
  switch (req.method)
    {
        case "GET":
            await getAllPost(req,res)
            break
    }
}


const getAllPost = async (req,res) => {
  try {
    let number;

    if(number === "" || number === undefined){
      number = 40
    }

    const data = await ProjectsSchema
    .find({})
    .sort({ "_id":-1 })
    .limit(number)
    
      return res.json(data);
  }
  catch(err) {
    console.log(err)
  }
}