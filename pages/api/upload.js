import { resolveCname } from 'dns'

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
    if(req.body.multiple === true){
        const {images} = req.body
        console.log(req.body, images.length);
        let files = new Array()
        let urlImageDownloaded = new Array()
        // get all base64 image
        let manageImages = () => {

            return images.map((image, i) => {
           files.push({
               data_url: image.data_url,
               filename: image.filename,
               type: image.type,
               bufferFile: new Buffer.from(image.data_url.replace(/^data:image\/\w+;base64,/, ""), 'base64')
            })

            const params = {
                Bucket: BUCKET_NAME,
                Key: `${image.filename.split(".")[0]}.${image.type}`, // File name you want to save as in S3
                Body: new Buffer.from(image.data_url.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
                ACL: 'public-read',
                ContentEncoding: 'base64',
                ContentType:`image/${image.type}`
            };

            let uploadImg = () => {
                return new Promise((resolve, reject) => {
                s3.upload(params, function(err, data) {
                    if (err) {
                        reject(err);
                    }
                    resolve(data.Location)
                    console.log(`File uploaded successfully. ${data} ${urlImageDownloaded}`);
                })
            }).then(result => {
                console.log("result", result)
                urlImageDownloaded.push(result);
                if(urlImageDownloaded.length === images.length) {
                    console.log("urlImageDownloaded", urlImageDownloaded)

                    new Promise((resolve) => {
                        resolve(urlImageDownloaded)
                    }).then((values) => {
                        res.status(201).json({
                            "urlDataList" : values,
                            "success": true
                        })
                    });
                }

            })
        }
        uploadImg()
        })
    }
        new Promise((resolve) => {
            resolve(manageImages())
        })

    }else {
        const {images} = req.body
        console.log(req.body, images.length);
        // get all base64 image
        let manageImages = () => {

            return images.map((image, i) => {
                console.log(image.filename)
            const params = {
                Bucket: BUCKET_NAME,
                Key: `${image.filename.split(".")[0]}.${image.type}`, // File name you want to save as in S3
                Body: new Buffer.from(image.data_url.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
                ACL: 'public-read',
                ContentEncoding: 'base64',
                ContentType:`image/${image.type}`
            };

            let uploadImg = () => {
                return new Promise((resolve, reject) => {
                s3.upload(params, function(err, data) {
                    if (err) {
                        reject(err);
                    }
                    resolve(data.Location)
                    console.log(`File uploaded successfully. ${data}`);
                })
            }).then(result => {

                if(images.length) {
                    new Promise((resolve) => {
                        resolve(result)
                    }).then((values) => {
                        res.status(201).json({
                            "urlDataList" : values,
                            "success": true
                        })
                    });
                }

            })
        }
        uploadImg()
        })
    }
        new Promise((resolve) => {
            resolve(manageImages())
        })

    }
}