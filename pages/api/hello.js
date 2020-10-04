export default hello = async (req, res) => {

try{
    res.status(200).json({
        "message" : "hello",
        "success" : "ok"
    })
}
catch(err){
console.log("aucune donéée a été remontée")
}
}