import React, { useState, useEffect} from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../../components/layout'
import Link from 'next/link'
import {projectConfig} from '../../../services/jsonProjects'
import Input from '../../../components/Input'
import InputConfig from '../../../components/InputConfig'
import Textarea from '../../../components/Textarea'
import Selects from '../../../components/Select'
import UploadFile from '../../../helpers/upload'
import { Button, Content, Image, Media, Card, Heading, Box, Loader, Tag, Form, Columns } from 'react-bulma-components';
import {useRouter} from 'next/router'
import ImageUploads from '../../../components/ImageUpload'
import baseUrl from '../../../helpers/baseUrl'
import { getAllPosts, getSinglePost } from '../../api/home'
import utilStyles from '../../../styles/utils.module.css'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import moment from 'moment'

const {Field, Control} = Form
console.log(projectConfig)

export async function getStaticProps({params:{id}}) {
  const posts = await getAllPosts()
  console.log("data", id)
  const currentPost = await getSinglePost(id)
 console.log("currentPost", currentPost)
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      currentPost: JSON.parse(JSON.stringify(currentPost))
    },
    revalidate: 1
  }
}

export default function Updateproject({dataProjects = projectConfig, posts, currentPost}) {
  const [configProject, setConfigProject] = useState(projectConfig)
  const [state, changeState] = useState({});
  const [value, setValue] = useState('');
  const [imageDownloaded, setImageDownloaded] = useState();
  const [onLoading, setOnLoading] = useState(false)
  const [booleanState, setBooleanState] = useState(false)
  const [dataSelect, setDataSelect] = useState({})
  const [tagsCategory, setTagsCategory] = useState([]);
  const [idPost, setIdPost] = useState()
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const {id} = router.query
  console.log(id)
  const [postToUpdate, setPostToUpdate] = useState([currentPost])
  const [updatePost, setUpdatePost] = useState([postToUpdate])
  console.log("idsingle Post", posts.filter(post =>{return post._id === id }), currentPost)
    const onChange = ({target}) => {
    // state$

    console.log(target.name, target.value)

    if(target.name === "listCategory"){
      let pushCategory = new Array()
      pushCategory.push(target.value)
      const checkValue = (arr, getValue) => {
        return arr.some(val => val === getValue)
      }
      console.log(checkValue(tagsCategory, target.value))
      changeState({...state, [target.name]: pushCategory, _id:id})

    }else{
      changeState({...state, [target.name]: target.value, _id:id})
    }
  }

  const onChangeState = (data) => {
      console.log("data from child", data)
      setValue(data)
      changeState({...state, "imageArray": data, _id:id})
      console.log("Form>", state);
  }

  const onChangeStateMain = (data) => {
    console.log("data from child", data)
    setValue(data)
    changeState({...state, "imageMainPrincipal": data, _id:id})
    console.log("Form>", state);
}

  const saveAllImage= () => {
    console.log("imagesArrayState", state.imageArray)
    let imagesDetails = new Array()
   let images = state.imageArray

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
        changeState({...state, "imageArray": dataProject.urlDataList, _id:id})
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
   let images = state.imageMainPrincipal

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
      changeState({...state, "imageMainPrincipal": dataProject.urlDataList, _id:id})
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
    changeState({...state, listCategory: tagsCategory, _id:id })
    console.log("update effect", state)
    fetch(`${baseUrl}/api/projects`,{
      method:"PUT",
      headers:{
      'Content-Type':'application/json'
      },
      body:JSON.stringify({
        projects:state
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

  const addTag = (name) => {
    let currentSelect = document.querySelector(`[name="${name}"]`)
    console.log("current sel", currentSelect.value);
    let listTags = tagsCategory
    const checkValue = (arr, getValue) => {
      return arr.some(val => val === getValue)
    }

    if(!checkValue(listTags, currentSelect.value)){
      listTags.push(currentSelect.value)
    }else{
      console.log('exist deja')
    }

    console.log(listTags)
    changeState({...state, "listTags":listTags, _id:id})
  }

  const deleteTag = (index) => {
    let arr = tagsCategory;
    let getIndex = arr[index]
    arr = arr.filter((value,index, arr) => {
      console.log(arr[index], value, arr)
      return value !== getIndex
    })

    setTagsCategory(arr)
    console.log("array", arr)

  }

  const deleteProject = (id) => {
    setOnLoading(true)
    fetch(`${baseUrl}/api/projects`,{
      method:"DELETE",
      headers:{
      'Content-Type':'application/json'
      },
      body:JSON.stringify({
        id:id,
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
    let selectAll = document.querySelectorAll('select')
      for(var i = 0; i < selectAll.length; i++){
        let currentSelector = document.querySelectorAll('select')[i]
        currentSelector.setAttribute("value", currentSelector.options[0].text)
      }
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
          {postToUpdate.map((post, j) => (
            <div key={j}>
              {dataProjects.map((item, i) => (
                <div key={`${item["name"]}${i}`}>
                    {item.type === "select" &&
                    <>
                    <Selects
                      key={`${item["name"]}${i}`}
                      onChange={onChange}
                      name={item["name"]}
                      list={item["option"]}
                      addtag={true}
                      onClick={(e) => {
                        e.preventDefault()
                        addTag(item["name"])}
                      }
                      value={state[item["name"]] === undefined ?
                      state[item["name"]] :
                      (state[item["name"]] === undefined ?
                        state[item["name"]][0]
                      :
                      state[item["name"]]
                      )
                    }
                    />
                    {item["name"] === 'listCategory' && <Field>
                      {post[item["name"]].map((tag, i)=>(
                        <Tag
                          style={{marginRight:"10px"}}
                          color="info"
                          key={i}>{tag}<a
                          onClick={(e) => {
                            e.preventDefault()
                            deleteTag(i)
                          }}
                          className="deleteTag">
                            X
                          </a>
                          </Tag>
                      ))}
                    </Field>
                    }
                    </>
                  }
                  {item.type === "textarea" &&
                  <Textarea
                    onChange={onChange}
                    name={item["name"]}
                    defaultValue={post[item["name"]]}
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
                      singleimage={post[item["name"]]}
                    />
                  </>
                  }
                  {item.name === "imageArray" &&
                    <ImageUploads
                      state={state}
                      name={item["name"]}
                      onChange={(e) => {onChangeState(e)}}
                      onSaveImages={saveAllImage}
                      numbers={3}
                      update={post[item["name"]]}
                    />
                  }
                  {
                      item.type !== "select" &&
                      item.type !== "textarea" &&
                      item.type !== "file" &&
                      <>
                      <InputConfig
                        defaultValue={post[item["name"]]}
                        onChange={onChange}
                        name={item["name"]}
                      />
                      </>
                  }
                </div>
            ))}
            </div>
          ))}
           <Button.Group
              hasAddons={false}
              position='centered'
              size='medium'
              style={{ width: '100%', padding:'20px' }}
            >
              <Button color="success" style={{marginRight:"15px"}} onClick={(event) => { submitForm(event) }}>Sauvegarder</Button>
              <Button color="info" onClick={(event) => {
                setDeleting(false)
                updateConfig(event)
              }}>Update</Button>
            </Button.Group>
      </form>
      <>
      <h1 className={utilStyles.heading2Xl}>
        <span className={utilStyles.nameSite}>
        Liste des projets</span>
      </h1>
      <Columns>
      {postToUpdate.map((post, i) => (
         <Columns.Column key={i} size={12}>
        <Card className="post">
          <Card.Image data-id={post._id} src={post.imageMainPrincipal} />
          <Card.Content>
          <Media>
            <Media.Item renderAs="figure" position="left">
              <Image size={64} alt="64x64" src="http://bulma.io/images/placeholders/128x128.png" />
            </Media.Item>
            <Media.Item>
              <Heading size={4}>{post.title}</Heading>
              <Heading subtitle size={6}>@johnsmith</Heading>
            </Media.Item>
          </Media>
          <Content>
            {post.description}
            <br />
            <time dateTime={moment(post.date).utc().format('LL', 'fr')}>{moment(post.date).locale('fr').format('LL', 'fr')}</time>
          </Content>
          </Card.Content>
          <Card.Footer>
          <Card.Footer.Item
            renderAs="a"
           onClick={(e) => {
             e.preventDefault()
             setDeleting(true)
             setIdPost(post._id)
           }}>Supprimer</Card.Footer.Item>
          <Card.Footer.Item>
            <Link href={'/admin/manageprojet/[id]'} as={`/admin/manageprojet/${post._id}`}>
              <a href={`"admin/manageprojet/${post._id}`}>View Post</a>
            </Link>
          </Card.Footer.Item>
          <Card.Footer.Item renderAs="a" href="#Maybe">Update</Card.Footer.Item>
        </Card.Footer>
        </Card>
        </Columns.Column>
      ))}
      </Columns>
      </>
      {deleting && <div data-idpost={idPost} className="deletedPost">
        <Field>
          <Control>
            <Heading>Etes vous sure ?</Heading>
            <Button.Group>
              <Button onClick={() =>{
                 setDeleting(false)
                deleteProject(idPost)
              }} color="danger">Supprimer</Button>
              <Button onClick={() => {
                setDeleting(false)
              }}
              color="info">Annuler</Button>
            </Button.Group>
          </Control>
        </Field>
      </div>}
    </Layout>
  )
}

// This function gets called at build time
export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    try{
      const post =  await getAllPosts()
      const posts = JSON.parse(JSON.stringify(post))
      // Get the paths we want to pre-render based on posts
      const paths = posts.map((post) => ({
        params: { id: post._id },
      }))

      // We'll pre-render only these paths at build time.
      // { fallback: false } means other routes should 404.
      return { paths, fallback: false }
    }
    catch(err){
      console.log(err)
    }
  }