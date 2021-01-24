import path from 'path'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import baseUrl from '../helpers/baseUrl'
import { uploadTempFile } from '../utils/uploads'
import { useRouter } from 'next/router'
import { Button, Image, Heading, Box, Loader, Tag, Form, Column } from 'react-bulma-components';
const {Field, InputFile, Control} = Form

/* component Loader File */
const UploadFile = ({imageExist, nameFile, onGet, callBack, getUrlImage}) => {
    // define router
    const router = useRouter()
    // ref input
    const uploadRef = useRef(null)
    /*manage state */
    const [onLoading, setOnLoading] = useState(false)
    const [imgDownloaded, setImgDownLoaded] = useState("")
    const [tmpFile, setTmpFile] = useState()
    const [filename, setFileName] = useState()
    const [saveTmpFile, setSaveTmpFile] = useState()
    const [loading, setLoading] = useState(false)
    const [overSize, setOverSize] = useState(false)
    /*end state */
    /* useEffect*/
    useEffect(()=> {
      console.log("useEffect Operation")
      console.log('imageExist', imageExist)
    },[])
    // const upload file
    const tmpFileUpload = (tmp) => {
        uploadTempFile(tmp)
      }
    /* upload function Js */
    const resetImage = () => {
      let nameSrc = nameFile
      document.getElementsByName(`mainLogo${nameSrc}`)[0].setAttribute("src"," ")
      getUrlImage()
    }
    const uploadImage = async(fileName) => {
        try{
          if(fileName !== undefined){
            getBase64Verification(fileName).then(result => {
              console.log("base64", result)

              const imgData = result;
              const buffer = Buffer.from(imgData.substring(imgData.indexOf(',') + 1));
              const sizeImg = buffer.length / 1e+6
              console.log("sizeImg", typeof(sizeImg))
              // Read file asynchronously.
              //if(sizeImg > 1){
              setOverSize(true)
              console.log("overSize", nameFile, overSize, sizeImg)
              let nameSrc = nameFile
              resizeImage(nameFile, result, sizeImg).then(result => {
                setSaveTmpFile(result)
                console.log("after click", nameFile, document.getElementsByName(`previewDone${nameSrc}`)[0])
                if(sizeImg > 1){
                  document.getElementsByName(`previewDone${nameSrc}`)[0].setAttribute("src",result)
                }else {
                  document.getElementsByName(`previewDone${nameSrc}`)[0].setAttribute("src",result)
                }

                setOnLoading(true)
                const getFile = fileName.name.split('.')
                const nameFile = getFile[0]
                const typeFile = getFile[1].toLowerCase()

                console.log(getFile, nameFile, typeFile, saveTmpFile)
                let imagesDetails = [{
                      data_url: result,
                      filename: nameFile,
                      type: typeFile
                    }]
            const res = fetch(`${baseUrl}/api/upload`,{
              method:"POST",
              headers:{
              'Content-Type':'application/json'
              },
              body:JSON.stringify({
                images:imagesDetails,
                multiple: false,
              })
            }).then((res) => {
              const data = res.json()
              data.then(result => {
                setImgDownLoaded(result.urlDataList)
                setLoading(result.success)
                setOnLoading(false)
                console.log(result)
                callBack()
                getUrlImage()
              })
              console.log("data resfont", data.urlDataList)
              console.log('upload image', data)
              })
              .catch((err) => {
                console.log("error during udpdating",err)
              });

              });

            })

          }
          else
          {
            return console.log('no image')
          }
        }
        catch(err){
          console.log(err)
        }
      }
    /* uploadFileImage */
    const uploadFileImage = (refLoad) => {
        const { current } = refLoad

        if(current.files[0] !== undefined){
            setTmpFile(URL.createObjectURL(current.files[0]))
            path.dirname(current.files[0].name)
            setFileName(current.files[0].name)
            tmpFileUpload(URL.createObjectURL(current.files[0]))
            // get url parameters
            let urlParams = new URL(window.location.href).searchParams
            // if url params has file, we get value of params
            if(urlParams.has("file")){
              let getFileParams = urlParams.get("file")
            }

            fileReaderImage(current.files[0])
        }
      }

      const fileReaderImage = (currentFile) => {
        // init new fileReader for get file
        let fileReader = new FileReader()
        let file = currentFile

        fileReader.onloadstart = function(progressEvent) {
            console.log("onloadstart!");
            var msg = "File Name: " + file.name + "<br>" +
                "File Size: " + file.size + "<br>" +
                "File Type: " + file.type;

            console.log(msg);
        }

        fileReader.onload = function(progressEvent) {
            setOnLoading(false)
            var stringData = fileReader.result;
            //console.log(" ---------------- File Content ----------------: ");
            setSaveTmpFile(stringData)
            //console.log("stringData", stringData);
           // resizeImage(nameFile, stringData);
        }

        fileReader.onloadend = function(progressEvent) {
            console.log("onloadend!");
            // FileReader.EMPTY, FileReader.LOADING, FileReader.DONE
            console.log("readyState = " + fileReader.readyState);
          // setTimeout(() => {
            const imgData = fileReader.result;
           console.log(imgData)
           const buffer = Buffer.from(imgData.substring(imgData.indexOf(',') + 1));
           const sizeImg = buffer.length / 1e+6
           console.log("sizeImg", typeof(sizeImg))
           // Read file asynchronously.
           if(sizeImg > 1){
            setOverSize(true)
            console.log("overSize", overSize, saveTmpFile)
           }
          // }, 2000)

        }

        fileReader.onerror = function(progressEvent) {
            console.log("onerror!");
        }

        console.log('overSize',overSize)
        // Read file asynchronously.
        if(overSize){
          console.log("over size")
        }

        fileReader.readAsDataURL(currentFile, "UTF-8"); // fileReader.result -> String.
        // router.push({
        //   pathname : router.pathname,
        //   query : {
        //     file : URL.createObjectURL(current.files[0])
        //   }
        // },
        // undefined,
        // { shallow: true })
      }

      const getBase64Verification = (currentFile) => {
          return new Promise(resolve => {
            // Check for the File API support.
            // init new fileReader for get file
          let fileReader = new FileReader()
          let file = currentFile

          fileReader.onload = function(progressEvent) {
              setOnLoading(false)
              var stringData = fileReader.result;
              resolve(stringData)
              setSaveTmpFile(stringData)
          }

          fileReader.onloadend = function(progressEvent) {
            console.log("readyState = " + fileReader.readyState);
          }

          fileReader.onerror = function(progressEvent) {
              console.log("onerror!");
          }

          fileReader.readAsDataURL(currentFile, "UTF-8"); // fileReader.result -> String.
        })
      }

      const resizeImage = (tagNameFile, stringData, sizeControl, nameSrc) => {
        return new Promise((resolve) => {
          if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log(document.getElementsByName(`${tagNameFile}File`)[0])
              let filesToUploads = document.getElementsByName(`${tagNameFile}File`)[0].files;
              let file = filesToUploads[0];
              let dataurl;
              let reader = new FileReader();

              if (file) {
                // Set the image once loaded into file reader
                reader.onload = function(e) {
                    let img = document.getElementsByName(`preview${nameFile}`)[0]
                    img.src = e.target.result;
                    let canvas = document.createElement("canvas");
                    let MAX_WIDTH = 600;
                    let MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    let ctx = canvas.getContext("2d");
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    console.log("sizeControl", sizeControl)
                    if(sizeControl < 1){
                      resolve(e.target.result)
                    }

                    if(sizeControl > 1) {
                      if (width > height) {
                          if (width > MAX_WIDTH) {
                              height *= MAX_WIDTH / width;
                              width = MAX_WIDTH;
                          }
                      } else {
                          if (height > MAX_HEIGHT) {
                              width *= MAX_HEIGHT / height;
                              height = MAX_HEIGHT;
                          }
                      }

                      canvas.width = width;
                      canvas.height = height;
                      ctx = canvas.getContext("2d");
                      ctx.drawImage(img, 0, 0, width, height);
                    }

                    dataurl = canvas.toDataURL(img, file.type);
                    if(sizeControl > 1) {
                      resolve(dataurl)
                    }
                }
                reader.readAsDataURL(file);
              }else {
                console.log('no image downloaded')
              }

          } else {
              alert('The File APIs are not fully supported in this browser.');
          }
        })
    }

    return (<div>
    <div>
        <h3>Main Logo</h3>
        <img name={`mainLogo${nameFile}`} src={onGet} width="250" style={{marginBottom: 30}}/>
        {onLoading &&
          <p>...en cours de telechargement</p>
        }
      </div>
    {!imgDownloaded &&
        <div className="resizePreview">
          <img
            src=""
            className={`previewDone${nameFile}`}
            name={`previewDone${nameFile}`}
            alt=""
          />
        </div>
    }
    <div>
    {imageExist &&
      <img src={onGet}
        width="200"
        className={`preview${nameFile}`}
        name={`preview${nameFile}`}
        alt=""
      />
      }
      {loading && imgDownloaded &&
            <div>
            <div><span>Url :</span><span style={{fontWeight:"bold"}}>{imgDownloaded}</span></div>
            <p>Image téléchargé</p>
            </div>
        }
      </div>
      <div className="upload_p" style={{display: "flex", marginBottom:15}}>
        <div>
          <input onChange={() => {
              uploadFileImage(uploadRef)
          }}
          name={`${nameFile}File`} id="file" type="file" ref={uploadRef} accept=".jpg, .jpeg, .png" />
        </div>
        <Field>
          <Control>
            <input className={`input ${nameFile}`} defaultValue={imgDownloaded} />
          </Control>
        </Field>
        <div>
          <Button
              color="info"
              className="buttonSubmit"
              onClick={(e) => {
              e.preventDefault()
              uploadImage(uploadRef.current.files[0], tmpFile)
          }}>Ajouter l'image</Button>
          <Button
              color="danger"
              className="buttonSubmit"
              onClick={(e) => {
              e.preventDefault()
              resetImage(e)
          }}>supprimer</Button>
        </div>
      </div>
      <div style={{display: "flex", marginBottom:30}}>
          <div style={{display: "block", width: "100%"}}>
            <input disabled={true} style={{width: "100%", height: 48, fontWeight: "bold"}} defaultValue={onGet} name={nameFile} />
          </div>
      </div>
      </div>)
}

export default UploadFile;