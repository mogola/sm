import fetch from 'isomorphic-unfetch'

import React, { useState, useEffect} from 'react'
import Head from 'next/head'
import Layout from './../../../components/layout'
import Link from 'next/link'
//import {projectConfig} from './../../../services/jsonProjects'
import InputConfig from './../../../components/InputConfig'
import Textarea from './../../../components/Textarea'
import Selects from './../../../components/Select'
import { Container, Button, Content, Image, Media, Card, Heading, Box, Loader, Tag, Form, Columns } from 'react-bulma-components';
import { useRouter } from 'next/router'
import ImageUploads from './../../../components/ImageUpload'
import baseUrl from './../../../helpers/baseUrl'
import utilStyles from './../../../styles/utils.module.css'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import moment from 'moment'
import { Editor } from '@tinymce/tinymce-react';
const {Field, Control, Label, Input} = Form;

export async function getServerSideProps(context) {
    const about = await fetch(`${baseUrl}/api/about`, { method: "GET" })
    const aboutItem = await about.json()

    return {
        props: {
            dataAbout: JSON.parse(JSON.stringify(aboutItem))
        },
    }
}

export default function Manageabout({dataAbout}) {
    const [dataFromAbout, setDataFromAbout] = useState(dataAbout)
    const [arrayKeys, setArrayKeys] = useState([])
    const [state, changeState] = useState({});
    const [onLoading, setOnLoading] = useState(false)
    const [getId, setGetId] = useState('')
    useEffect(() => {
        console.log("data About", dataAbout)
        console.log(Object.entries(dataFromAbout.data))
        setArrayKeys(Object.entries(dataFromAbout.data))
        setGetId(Object.entries(dataFromAbout.data)[0][1])
    }, [])

    const handleChangeEditor = (target) => {
        let getName = target.getElement().name
        const cloneArray = { ...state }
        console.log(getName)
        cloneArray[getName] = target.getContent()

        changeState({...state, [getName]: target.getContent()})
        console.log("new value", state)
        //console.log('target', target.getContent(), target)
      }

      const onChange = ({target}) => {
        changeState({...state, [target.name]: target.value})
        console.log("new value", state)
      }

      const onChangeStateMain = (data) => {
        console.log("data from child", data)
        changeState({...state, "urlProfilImage": data})
        console.log("Form>", state);
    }

    const onSaveMainImage = () => {
        setOnLoading(true)

           let imagesDetails = new Array()
          let images = state.urlProfilImage

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
             changeState({...state, "urlProfilImage": dataProject.urlDataList})
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
        console.log('_id', arrayKeys[0][1])
        console.log("update effect", state)
        fetch(`${baseUrl}/api/updatepost`,{
          method:"PUT",
          headers:{
          'Content-Type':'application/json'
          },
          body:JSON.stringify({
            collection:"About",
            "_id": arrayKeys[0][1],
            "data":state
          })
        }).then(async (result) => {
          let resultData = await result.json()
          console.log(resultData)
            notifySuccess()
            setOnLoading(false)
        })
      }

      const createPost = async (e) => {
        e.preventDefault()
        setOnLoading(true)
        fetch(`${baseUrl}/api/updatepost`,{
          method:"POST",
          headers:{
          'Content-Type':'application/json'
          },
          body:JSON.stringify({
            data: dataAbout
          })
        }).then(async (result) => {
          let resultData = await result.json()
          console.log(resultData)
            notifySuccess()
            setOnLoading(false)
        })
      }
  return (
    <Layout dashboard>
      <Head>
        <title>About configuration</title>
      </Head>
      <ToastContainer />
      {onLoading && <Loader className="loadDiv" />}
      <form>
            <Container>
                {arrayKeys.map((item, i) => (
                    <Field key={i}>
                        <Control>
                            <Label>
                                {item[0]}
                            </Label>
                            {(item[0] !== "descriptionProfil" && item[0] !== "description")  &&
                                <input
                                    className="input"
                                    name={item[0]}
                                    defaultValue={item[1]}
                                    onChange={onChange}
                                />
                            }
                        {(item[0] === "descriptionProfil" || item[0] === "description")  &&
                        <Editor
                            apiKey="n20l3oxsnnev0ao8wjw8bqhpou0jajpz8ew2r3pysqf0mxgn"
                            initialValue={item[1]}
                            tagName={item[0]}
                            textareaName={item[0]}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                'advlist autolink lists link image',
                                'charmap print preview anchor help',
                                'searchreplace visualblocks code',
                                'insertdatetime media table paste wordcount'
                                ],
                                toolbar:
                                'undo redo | formatselect | bold italic | \
                                alignleft aligncenter alignright | \
                                bullist numlist outdent indent | help | forecolor backcolor'
                            }}
                            onChange={({target}) => {
                                handleChangeEditor(target)
                              }}
                            />
                        }
                        {item[0] === "urlProfilImage" &&
                            <>
                            <ImageUploads
                                state={state}
                                name={item[0]}
                                onChange={(e) => {onChangeStateMain(e)}}
                                onSaveImages={onSaveMainImage}
                                numbers={1}
                                singleimage={item[1]}
                                numbers={1}
                              />
                            </>
                        }
                    </Control>
                    </Field>

                ))}

                <Button
                    onClick={(e) => {
                        e.preventDefault()
                        submitForm(e)
                    }}
                    color="primary">
                    Update
                </Button>
                <Button
                    onClick={(e) => {
                        e.preventDefault()
                        createPost(e)
                    }}
                    color="primary">
                    CreatePost
                </Button>
            </Container>
        </form>
    </Layout>
  )
}