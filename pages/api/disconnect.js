
export default async (req,res)=>{
    switch (req.method)
      {
          case "POST":
              await disconnect(req,res)
              break
      }
  }
const disconnect = (req, res) => {
  try{
      res.json({
          "userIsConnect": false
      })
  }
  catch(err){
  }
}