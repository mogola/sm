const fs = require('fs');
const path = require('fs');
import matter from 'gray-matter'
import fetch from 'node-fetch'
import useSWR from 'swr'
const AWS = require('aws-sdk');
const ID = "AKIAIMNFQJXXL7TWRXKA"
const SECRET = "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"
const BUCKET_NAME = "testbucketcreateds3"
// Enter copied or downloaded access ID and secret key here
// const ID = process.env.ID_AWS;
// const SECRET = process.env.SECRET_AWS;

// // The name of the bucket that you have created
// const BUCKET_NAME = process.env.BUCKET_NAME;
const fsFile = (url) => {
    const {readFileSync} = fs
    return readFileSync(url)
}
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

export function awsUpload(nameBucket){
    const params = {
        Bucket: nameBucket,
        CreateBucketConfiguration: {
            // Set your region here
            LocationConstraint: "eu-west-3"
        }
    };
    console.log(nameBucket, ID, SECRET)
    s3.createBucket(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log('Bucket Created Successfully', data.Location);
    });
}

export function uploadFile(fileName, fullURL){
      // Read content from the file
      console.log("fileName", fileName)
      if(fileName !== undefined){
      const dirPath = path.dirname("C:\\Users\\msangare\\Pictures\\")
      const pathsrc = fileName
      const fullPath = dirPath + "\\" + pathsrc
      const fileContent = fsFile(fullURL)
      console.log("fullPath", fullPath)

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
    }else{
        console.log("noncontent")
    }
};

export function uploadTempFile(fileNameTemp){
    // Read content from the file
    if(fileNameTemp !== undefined){
        console.log(fileNameTemp)
        return fileNameTemp.name
  }else{
      console.log("noncontent")
  }
};

export function getCurrentURL(){
    return "http://localhost:8500/admin/dashboard?file=blob%3Ahttp%3A%2F%2Flocalhost%3A8500%2F12295ec9-f693-4f34-881d-b7f2d64b63b1"
}