import path from 'path'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import baseUrl from '../helpers/baseUrl'
import { uploadTempFile } from '../utils/uploads'
import { useRouter } from 'next/router'

/* component Loader File */
const UploadFile = ({nameFile , onGet, callBack, getUrlImage}) => {
    // define router
    const router = useRouter()
    // ref input
    const uploadRef = useRef(null)
    /*manage state */
    const [onLoading, setOnLoading] = useState(false)
    const [imgDownloaded, setImgDownLoaded] = useState()
    const [tmpFile, setTmpFile] = useState()
    const [filename, setFileName] = useState()
    const [saveTmpFile, setSaveTmpFile] = useState()
    const [loading, setLoading] = useState(false)
    /*end state */
    /* useEffect*/
    useEffect(()=> {
      console.log("useEffect Operation")
    },[saveTmpFile])
    // const upload file
    const tmpFileUpload = (tmp) => {
        uploadTempFile(tmp)
      }
    /* upload function Js */
    const uploadImage = async(fileName) => {
        try{
          if(fileName !== undefined){
            setOnLoading(true)
            const getFile = fileName.name.split('.')
            const nameFile = getFile[0]
            const typeFile = getFile[1].toLowerCase()

            console.log(getFile, nameFile, typeFile, saveTmpFile)

            const res = await fetch(`${baseUrl}/api/upload`,{
              method:"POST",
              headers:{
              'Content-Type':'application/json'
              },
              body:JSON.stringify({
                file : saveTmpFile,
                name : nameFile,
                type: typeFile
              })
            }).then((res) => {
              const data = res.json()
              data.then(result => {
                setImgDownLoaded(result.url)
                setLoading(result.success)
                setOnLoading(false)
                console.log(result)
                callBack()
                getUrlImage()
              })
              console.log("data resfont", data.url)
              console.log('upload image', data)
              })
              .catch((err) => {
                console.log("error during udpdating",err)
              });
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

            // init new fileReader for get file
            let fileReader = new FileReader()
            let file = current.files[0]

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
                console.log(" ---------------- File Content ----------------: ");
                setSaveTmpFile(stringData)
                console.log("stringData", stringData);
                resizeImage(nameFile, stringData);
            }

            fileReader.onloadend = function(progressEvent) {
                console.log("onloadend!");
                // FileReader.EMPTY, FileReader.LOADING, FileReader.DONE
                console.log("readyState = " + fileReader.readyState);
                setTimeout(() => {
                  console.log('end of downloaded image');
                  console.log("saveTmpFile", saveTmpFile)
                }, 1500)
            }

            fileReader.onerror = function(progressEvent) {
                console.log("onerror!");
            }

            // Read file asynchronously.
            fileReader.readAsDataURL(current.files[0], "UTF-8"); // fileReader.result -> String.
            // router.push({
            //   pathname : router.pathname,
            //   query : {
            //     file : URL.createObjectURL(current.files[0])
            //   }
            // },
            // undefined,
            // { shallow: true })
        }
      }

      const resizeImage = (tagNameFile, stringData) => {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          console.log(document.getElementsByName(`${tagNameFile}File`)[0])
            let filesToUploads = document.getElementsByName(`${tagNameFile}File`)[0].files;
            let file = filesToUploads[0];
            let dataurl;
            console.log(file)

            const img = stringData;
            const buffer = Buffer.from(img.substring(img.indexOf(',') + 1));
            const sizeImg = buffer.length / 1e+6
            console.log("Byte length: " + buffer.length);
            console.log("MB: " + sizeImg);

            let reader = new FileReader();

            if (file) {
              // Set the image once loaded into file reader
              reader.onload = function(e) {
                  let img = document.getElementsByName(`preview${nameFile}`)[0]
                  img.src = e.target.result;
                  console.log(e.target)

                  let canvas = document.createElement("canvas");

                  let MAX_WIDTH = 600;
                  let MAX_HEIGHT = 600;
                  let width = img.width;
                  let height = img.height;

                  console.log('height', height, 'width', width)
                  if(sizeImg > 1){
                    console.log('trop grand')
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
                  }
                  canvas.width = width;
                  canvas.height = height;
                  var ctx = canvas.getContext("2d");
                  ctx.drawImage(img, 0, 0, width, height);

                  dataurl = canvas.toDataURL(img, file.type);
                  document.getElementsByName(`previewDone${nameFile}`)[0].setAttribute("src",dataurl)
                  setSaveTmpFile(dataurl)
              }
              reader.readAsDataURL(file);
            }else {
              console.log('no image downloaded')
            }

        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    }

    return (<div>
    <div>
        <h3>Preview Logo</h3>
        <img src={onGet} width="250" style={{marginBottom: 30}}/>
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
      <img src={onGet}
        width="200"
        className={`preview${nameFile}`}
        name={`preview${nameFile}`}
        alt=""
      />
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
        <div>
          <input className={nameFile} value={imgDownloaded} />
        </div>
        <div>
          <button
              className="buttonSubmit"
              onClick={(e) => {
              e.preventDefault()
              uploadImage(uploadRef.current.files[0], tmpFile)
          }}>Ajouter l'image</button>
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