const fs = require('fs')
const path = require("path")
const AWS = require('aws-sdk')

const ID = "AKIAIMNFQJXXL7TWRXKA"
const SECRET = "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"
const BUCKET_NAME = "testbucketcreateds3"
// Enter copied or downloaded access ID and secret key here
// const ID = process.env.ID_AWS;
// const SECRET = process.env.SECRET_AWS;

// // The name of the bucket that you have created
// const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});


export default async (req,res)=>{
    switch(req.method){
        case "POST":
          await postImage(req,res)
          break;
    }
}

const postImage = async (req, res) => {
    const {file, name, type} = req.body
    // This method is *CORRECT*:
    // const { sep } = path
    // fs.mkdtemp(`${sep}tmp`, (err, directory) => {
    // if (err) throw err;
    // console.log(directory);
    // // Will print something similar to `/tmp/abc123`.
    // // A new temporary directory is created within
    // // the /tmp directory.
    // });

    // fs.copyFile("public\\images\\profile.png", 'dest.png', (err) => {
    //     if (err) console.log(err);
    //     console.log('file was copied');
    // });

    // fs.realpath("public\\images\\profile.png", (err, pathResolved)=>{
    //     if (err) console.log(err);
    //     console.log("realpath", pathResolved);
    // })
    // const fileContent = fs.readFileSync(file);

    //const fileContent = file
    let base64 = file

    const fileContent = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    const params = {
        Bucket: BUCKET_NAME,
        Key: `${name}.${type}`, // File name you want to save as in S3
        Body: fileContent,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentTyppe:`image/${type}`
    };

    //Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }

    res.status(201).json({
        "url" : data.Location,
        "success": true
    })
        console.log(`File uploaded successfully. ${data.Location}`);
    });
}