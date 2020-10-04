const fs = require("fs");
const path = require("path")
const AWS = require('aws-sdk');

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


const uploadFile = (fileName) => {
    // Read content from the file
    fileName = "Capture.PNG"
   const dirPath = path.dirname("C:\\Users\\msangare\\Pictures\\")
    const pathsrc = fileName

    const fullPath = path.format({
        dir: 'C:\\Users\\msangare\\Pictures\\',
        base: fileName
      });
   console.log("path", fullPath);
    //const fileContent = fullPath
   const fileContent = fs.readFileSync(fullPath);
   // const fileContent = fs.readFile(fileName, "utf-8");

    console.log("fileContent", fileContent);
    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'picture.png', // File name you want to save as in S3
        Body: fileContent
    };

    //Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

uploadFile();