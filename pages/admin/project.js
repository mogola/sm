import React, { useState, useEffect} from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import Link from 'next/link'
import {projectConfig} from './../../services/jsonProjects'
import Input from '../../components/Input'
import InputConfig from '../../components/InputConfig'
import Textarea from '../../components/Textarea'
import Selects from '../../components/Select'
import UploadFile from './../../helpers/upload'
import { Button, Heading, Box, Loader, Tag, Form, Column } from 'react-bulma-components';
import Files from './../../components/File'
import ImageUploads from './../../components/ImageUpload'
import baseUrl from '../../helpers/baseUrl'
import { getAllPosts } from '../api/home'

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';


console.log(projectConfig)

export async function getStaticProps() {
  const posts = await getAllPosts()
  console.log("data", posts)

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts))
    },
    revalidate: 1, // In secondes
  }
}

export default function Default({dataProjects = projectConfig, posts}) {
  const [configProject, setConfigProject] = useState(projectConfig)
  const [state, changeState] = useState({});
  const [value, setValue] = useState('');
  const [imageDownloaded, setImageDownloaded] = useState();
  const [onLoading, setOnLoading] = useState(false)

  const onChange = ({target}) => {
    // state$

    console.log(target.name, target.value)

    if(target.name === "listCategory"){
      let pushCategory = new Array()
      pushCategory.push(target.value)
      changeState({...state, [target.name]: pushCategory})
    }else{
      changeState({...state, [target.name]: target.value})
    }
  }

  const onChangeState = (data) => {
      console.log("data from child", data)
      setValue(data)
      changeState({...state, "arrayImage": data})
      console.log("Form>", state);
  }

  const onChangeStateMain = (data) => {
    console.log("data from child", data)
    setValue(data)
    changeState({...state, "mainImage": data})
    console.log("Form>", state);
}

  const saveAllImage= () => {
    console.log("imagesArrayState", state.arrayImage)
    let imagesDetails = new Array()
   let images = state.arrayImage

   setOnLoading(true)
   images.map((image, i) => {
     imagesDetails.push({
       data_url: image.data_url,
       filename: image.file.name,
       type: image.file.type.replace("image/", "")
      })
   })

   console.log(imagesDetails)

    fetch(`${baseUrl}/api/upload`,{
      method:"POST",
      headers:{
      'Content-Type':'application/json'
      },
      body:JSON.stringify({
        images:imagesDetails,
        multiple: true,
      })
    }).then(result => {
      let resultData = result.json()
      resultData.then(dataProject => {
        console.log(dataProject)
        console.log("resulting images", dataProject.urlDataList)
        setImageDownloaded(dataProject.urlDataList)
        changeState({...state, "arrayImage": dataProject.urlDataList})
        notifySuccess()
        setOnLoading(false)

        setTimeout(() => {
          setImageDownloaded([])
        }, 4000)
      })
    })
}

const onSaveMainImage = () => {
 setOnLoading(true)

    let imagesDetails = new Array()
   let images = state.mainImage

   setOnLoading(true)
   images.map((image, i) => {
     imagesDetails.push({
       data_url: image.data_url,
       filename: image.file.name,
       type: image.file.type.replace("image/", "")
      })
   })

  fetch(`${baseUrl}/api/upload`,{
    method:"POST",
    headers:{
    'Content-Type':'application/json'
    },
    body:JSON.stringify({
      images:imagesDetails,
      multiple: false,
      mainImage: true,
    })
  }).then(result => {
    let resultData = result.json()
    resultData.then(dataProject => {
      console.log(dataProject)
      console.log("resulting images", dataProject.urlDataList)
      changeState({...state, "mainImage": dataProject.urlDataList})
      notifySuccess()
      setOnLoading(false)
    })
  })
}

const notifySuccess = () => {
  toast.success("Save", {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    onOpen: () => {
      setOnLoading(false)
      console.log("success")
    }
  })
}
  const submitForm = async (e) => {
    e.preventDefault()
    setOnLoading(true)
    console.log("update effect", state)

    fetch(`${baseUrl}/api/projects`,{
      method:"POST",
      headers:{
      'Content-Type':'application/json'
      },
      body:JSON.stringify({
        projects:state,
      })
    }).then(result => {
      let resultData = result.json()
      resultData.then(dataProject => {
        console.log("resulting post", dataProject)
        notifySuccess()
        setOnLoading(false)
      })
    })
  }

  useEffect(() => {
    console.log("update state", state, imageDownloaded)
  }, [state, imageDownloaded])

  return (
    <Layout dashboard>
      <Head>
        <title>New project</title>
      </Head>
      <ToastContainer />
      {onLoading && <Loader className="loadDiv" />}
      <form onSubmit={submitForm}>
        {imageDownloaded && <div style={{position:"fixed", top:"50px", right:"50px"}}>
          {imageDownloaded.map((image, i) => (
              <img width={200} key={i} src={image} />
          ))}
          </div>}
          {dataProjects.map((item, i) => (
              <div key={`${item["name"]}${i}`}>
                  {item.type === "select" &&
                  <Selects
                    key={`${item["name"]}${i}`}
                    onChange={onChange}
                    name={item["name"]}
                    list={item["option"]}
                    value={state[item.name[0]]}
                  />
                }
                {item.type === "textarea" &&
                <Textarea
                  onChange={onChange}
                  name={item["name"]}
                  placeholder="Description..."
                />
                }
                {item.type === "file" &&
                item.name !== "imageArray" &&
                <>
                <ImageUploads
                    state={state}
                    name={item["name"]}
                    onChange={(e) => {onChangeStateMain(e)}}
                    onSaveImages={onSaveMainImage}
                    numbers={1}
                  />
                </>
                }
                {item.name === "imageArray" &&
                  <ImageUploads
                    state={state}
                    name={item["name"]}
                    onChange={(e) => {onChangeState(e)}}
                    onSaveImages={saveAllImage}
                    numbers={2}
                  />
                }
                {
                    item.type !== "select" &&
                    item.type !== "textarea" &&
                    item.type !== "file" &&
                    <InputConfig
                      value={state[item.name]}
                      onChange={onChange}
                      name={item["name"]}
                    />
                }
              </div>
          ))}
           <Button.Group
              hasAddons={false}
              position='centered'
              size='medium'
              style={{ width: '100%', padding:'20px' }}
            >
              <Button color="success" style={{marginRight:"15px"}} onClick={(event) => { submitForm(event) }}>Sauvegarder</Button>
              <Button color="info" onClick={(event) => { updateConfig(event) }}>Update</Button>
            </Button.Group>
      </form>
      <>
      {posts.map((post, i) => (
        <div key={i} className="post">
          <div data-id={post._id}>{post.title}
          <img src={post.imageMainPrincipal} width={70} />
          </div>
        </div>
      ))}
      </>
    </Layout>
  )
}