import fs, { fstat, promises } from 'fs'
import path from 'path'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import { getPost } from '../../api/posts'
import {awsUpload, uploadFile, uploadTempFile} from '../../utils/uploads'
import Layout, { siteTitle } from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import styles from '../../components/layout.module.css'
import { set } from 'mongoose'

export async function getStaticProps() {
  const post = await getPost()

  return {
    props: {
      homes: JSON.parse(JSON.stringify(post))
    }
  }
}

const addPost = async (title, urlImage, linkImage, callback) => {
  try{
    const res =  await fetch(`${baseUrl}/api/posts`,{
        method:"POST",
        headers:{
        'Content-Type':'application/json'
        },
        body:JSON.stringify({
          title,
          urlImage,
          linkImage
        })
      })
      .then((res) => {
          console.log('post is added')
          const data = res.json()
          data.then(() => {
            if(data.success){
              return callback
            }
          })

        })
        .catch((err) => {
          console.log("error during udpdating",err)
        });
    }
    catch(err){
      console.log(err)
    }
}

const deletePost = async (id) => {
  try{
    const res =  await fetch(`${baseUrl}/api/posts`,{
        method:"DELETE",
        headers:{
        'Content-Type':'application/json'
        },
        body:JSON.stringify({id})
      })
      const res2 = await res.json()
      console.log(res2)
    }
    catch(err){
      console.log(err)
    }
}

const updatePost = async (e,post,callback) => {
  e.preventDefault()
  try{
    const {_id, urlImage, title} = post
    const res =  await fetch(`${baseUrl}/api/posts`,{
      method:"PUT",
      headers:{
      'Content-Type':'application/json'
      },
      body:JSON.stringify({_id, urlImage, title})
    })
    .then((res) => {
      console.log('post is update', res.json())
      return callback
      })
      .catch((err) => {
        console.log("error during udpdating",err)
      });
    }
    catch(err){
      console.log(err)
    }
}

export default function Dashboard({ homes }) {
  const router = useRouter()

  // ref input
  const uploadRef = useRef(null)

  const [tempLiveEditTitle, setTempLiveEditTitle] = useState(homes);
  const [liveEditTitle, setLiveEditTitle] = useState(homes);
  const [title, setTitle] = useState();
  const [urlImage, setUrlImage] = useState();
  const [reset, setReset] = useState(false);
  const [tempPost, setTempPost] = useState()
  const [filename, setFileName] = useState()
  const [tmpFile, setTmpFile] = useState()
  const [saveTmpFile, setSaveTmpFile] = useState()
  const [imgDownloaded, setImgDownLoaded] = useState()
  const [loading, setLoading] = useState(false)
  const [onLoading, setOnLoading] = useState(false)
  const [postAdded, setPostAdded] = useState(false)

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      await addPost(title, urlImage, imgDownloaded, router.push({pathname: '/admin/dashboard'}))
      router.reload()
    }
    catch(err){
      console.log(err)
    }
  }

  const tmpFileUpload = (tmp) => {
    uploadTempFile(tmp)
  }

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

  const editHomePost = (e, obj) => {
    let elementsIndex = liveEditTitle.find(post => post._id == obj._id)
    let newArray = [...liveEditTitle]
    elementsIndex[e.target.name] = e.target.value
    elementsIndex = {...elementsIndex }
    setLiveEditTitle(newArray)
  }

  const modify = (e, obj) => {
    let eIndex = liveEditTitle.findIndex(post => post._id == obj._id)
    let newArray = [...liveEditTitle]

    newArray[eIndex] =  {...newArray[eIndex],
      onModify: obj.onModify === undefined
      ? true
      : !newArray[eIndex].onModify
    }

    setLiveEditTitle(newArray)
  }

  const resetPost = (e, obj) => {
    let elementsIndex = homes.find(post => post._id == obj._id)
    let eIndex = liveEditTitle.findIndex(post => post._id == obj._id)
    tempLiveEditTitle[eIndex] =  {...elementsIndex, onModify: true}

    console.log(tempLiveEditTitle, tempLiveEditTitle[eIndex])
    setLiveEditTitle(tempLiveEditTitle)
    setTempPost(eIndex)
    setReset(true)
  }

  const redirectPost = (post) => {
    router.push(`/posts/${post._id}`)
  }

  const uploadFileImage = (refLoad) => {
    if(refLoad.current.files[0] !== undefined){
        console.log(URL.createObjectURL(refLoad.current.files[0]))
        setTmpFile(URL.createObjectURL(refLoad.current.files[0]))
        path.dirname(refLoad.current.files[0].name)
        setFileName(refLoad.current.files[0].name)
        tmpFileUpload(URL.createObjectURL(refLoad.current.files[0]))
        let urlParams = new URL(window.location.href).searchParams
        if(urlParams.has("file")){
          let getFileParams = urlParams.get("file")
          console.log("getFileParams", getFileParams)
        }

        let fileReader = new FileReader()
        let file = refLoad.current.files[0]

        fileReader.onloadstart = function(progressEvent) {
            console.log("onloadstart!");
            var msg = "File Name: " + file.name + "<br>" +
                "File Size: " + file.size + "<br>" +
                "File Type: " + file.type;

            console.log(msg);
        }

        fileReader.onload = function(progressEvent) {
            console.log("onload!");
            setOnLoading(false)
            var stringData = fileReader.result;
            console.log(" ---------------- File Content ----------------: ");
            setSaveTmpFile(stringData)
            console.log(stringData);
        }

        fileReader.onloadend = function(progressEvent) {
            console.log("onloadend!");
            // FileReader.EMPTY, FileReader.LOADING, FileReader.DONE
            console.log("readyState = " + fileReader.readyState);
        }

        fileReader.onerror = function(progressEvent) {
            console.log("onerror!");
            console.log("Has Error!");
        }

        // Read file asynchronously.
        fileReader.readAsDataURL(refLoad.current.files[0], "UTF-8"); // fileReader.result -> String.
        router.push({
          pathname : router.pathname,
          query : {
            file : URL.createObjectURL(refLoad.current.files[0])
          }
        },
        undefined,
        { shallow: true })
    }
  }

  useEffect(() => {
      const handleRouteChange = (url) => {
          console.log('App is changing to: ', url)
        }
      router.events.on('beforeHistoryChange', handleRouteChange)
      console.log("reset", reset)

      if(postAdded){
        router.push('/admin/dashboard')
      }

      if(reset){
        setReset(false)
      }
  }, [reset])

  return (
    <Layout dashboard>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="dash_container">

          <div>
            <h3>Preview de l'image</h3>
            {onLoading &&
              <p>...en cours de telechargement</p>
            }
          </div>

        {loading && imgDownloaded &&
        <div>
          <img src={imgDownloaded} with={200} />
          <p>Image téléchargé</p>
        </div>}
        <form>
        <Link href="/">
            <a>
              <img src={tmpFile}
                width="200"
                className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                alt=""
              />
            </a>
          </Link>
          <div className="upload_p">
          <input onChange={() => {
            uploadFileImage(uploadRef)
          }} name="file" type="file" ref={uploadRef} accept=".jpg, .jpeg, .png" />
          <input defaultValue={filename} />
          <button onClick={(e) => {
            e.preventDefault()
              uploadImage(uploadRef.current.files[0], tmpFile)
          }}>Ajouter l'image</button>
          </div>
          <div className="title_p">
            <label htmlFor="title">title</label>
            <input
              name="title"
              defaultValue=""
              onChange={(e) => {
                setTitle(e.target.value)
              }}
            />
          </div>
          <div className="url_p">
            <label htmlFor="url">Url Image</label>
            <input
              name="urlImage"
              defaultValue=""
              onChange={(e) => {
                setUrlImage(e.target.value)
              }}
            />
          </div>
        <button onClick={(event)=> {submitForm(event)}}>Ajouter du contenu</button>
        </form>
        <ul>
        {liveEditTitle.map((post, i) => (
          <li key={i}>
            <div>id : {post._id}</div>
            {post.linkImage &&
              <img src={post.linkImage} width={200} />
            }
            <h2>{post.title}</h2>
            <h3>{post.urlImage}</h3>
            <Link href={'/posts/[id]'} as={`/posts/${post._id}`}>
              <a>View Post</a>
            </Link>
            <button onClick={(e) => {
              modify(e, post)
            }}>Modifier</button>
            {post.onModify && <div>
              <form>
              <div className="title_p">
                <label htmlFor="title_e">title</label>
                <input
                  name="title"
                  value={post.title}
                  onChange={(e) => {
                    editHomePost(e, post)
               }}
                />
              </div>
              <div className="url_p">
                <label htmlFor="url_e">Url Image</label>
                <input
                  name="urlImage"
                  value={post.urlImage}
                  onChange={(e) => {
                      editHomePost(e, post)
                    }
                  }
                />
              </div>
            </form>
            <button onClick={(e) => {
               updatePost(e,post,redirectPost(post))
              }} >Save
            </button>
            <button data-id={post._id} onClick={(e) => {
               e.preventDefault()
               deletePost(e.target.attributes['data-id'].value)
              }}>Delete
            </button>
            <button onClick={(e) => {
              e.preventDefault()
              resetPost(e, post)
            }}>Annuler
            </button>
              </div>}
          </li>
        ))}
      </ul>
      </div>
    </Layout>
  )
}