import Head from 'next/head'
import Link from 'next/link'
import fetch from 'node-fetch'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import Layout, { siteTitle } from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import styles from '../../components/layout.module.css'
import { getPostConfig } from '../api/home'
import { themeContext, getUrlSaved } from './../../context/context'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { themeContextUser } from './../../context/contextUser'
import Input from '../../components/Input'
import InputConfig from '../../components/InputConfig'
import UploadFile from './../../helpers/upload'
import { Button, Heading, Box, Loader, Tag, Form, Column } from 'react-bulma-components';

import { Editor } from '@tinymce/tinymce-react';
const { Field, InputFile, Control } = Form
export async function getStaticProps() {
  const config = await getPostConfig()

  return {
    props: {
      config: JSON.parse(JSON.stringify(config[0]))
    },
    revalidate: 1, // In secondes
  }
}

const addConfig = async (config) => {
  try {
    console.log("new data", config)
    const res = await fetch(`${baseUrl}/api/homeconfig`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ config: config })
    })
      .then((res) => {
        console.log('post is added')
        const data = res.json()
        data.then(() => {
          if (data.success) {
            // call function
            return ""
          }
        })

      })
      .catch((err) => {
        console.log("error during udpdating", err)
      });
  }
  catch (err) {
    console.log(err)
  }
}

export default function Config({ config, connect }) {
  console.log(config)
  const [labelInputItem, setInputItemLabel] = useState(Object.keys(config))
  const [dataConfig, setDataConfig] = useState(config)
  const [inputSocial, setInputSocial] = useState(config)
  const refInput = Object.keys(dataConfig).map(x => useRef(null));
  const [isUserAdmin, setIsUserAdmin] = useState()

  useEffect(() => {
    localStorage.setItem("formData", dataConfig)
    setIsUserAdmin(connect)
  }, [dataConfig])


  const submitForm = async (event) => {
    event.preventDefault();
    try {
      await addConfig(dataConfig)
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleChangeSocial = (i, name, target) => {
    const cloneArray = { ...dataConfig }
    console.log(cloneArray[name][i].name)
    console.log("get current value", target.getAttributeNode("i_name"))
    let refInputName, refInputUrl;
    if (target.hasAttribute("i_name")) {
      refInputName = target.value
      cloneArray[name][i].name = refInputName
      console.log(refInputName)
    }
    if (target.hasAttribute("i_url")) {
      refInputUrl = target.value
      cloneArray[name][i].url = refInputUrl
      console.log(refInputUrl)
    }
    if (target.hasAttribute("i_content")) {
      refInputUrl = target.value
      cloneArray[name][i].content = refInputUrl
      console.log(refInputUrl)
    }

    setDataConfig(cloneArray)
    console.log("currentValue", cloneArray)
  }

  const handleChange = (i, target) => {
    const cloneArray = { ...dataConfig }
    console.log(target.name)
    cloneArray[target.name] = target.value

    setDataConfig(cloneArray)
    console.log(dataConfig)
  }
  const updateConfig = async (e) => {
    e.preventDefault()
    console.log('nameCategory', dataConfig)

    // let menuCategoryExist;

    // if (dataConfig["menuCategoryLink"] === undefined) {
    //   menuCategoryExist = { ...dataConfig, menuCategoryLink: [{ name: "test", url: "example of url" }] }
    // } else {
    //   menuCategoryExist = { ...dataConfig }
    // }

    // if(config["textContentServices"] === undefined){
    //   menuCategoryExist = {...dataConfig, textContentServices: []}
    // }

    // console.log("update menucategoryLink", menuCategoryExist)

    try {
      const res = await fetch(`${baseUrl}/api/homeconfig`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config : dataConfig })
      })
        .then((res) => {
          setDataConfig(dataConfig)
          notifySuccess()
        })
        .catch((err) => {
          console.log("error during udpdating", err)
        });
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleChangeEditor = (target) => {
    let getName = target.getElement().name
    const cloneArray = { ...dataConfig }
    console.log(getName)
    cloneArray[getName] = target.getContent()

    setDataConfig(cloneArray)
    console.log("new value", dataConfig)
    //console.log('target', target.getContent(), target)
  }

  const deleteItem = (i, name) => {
    let updateArray = { ...dataConfig }
    const arrayToDelete = [...inputSocial[name]]
    console.log(arrayToDelete)
    let newArrayDeleted = arrayToDelete.filter((value, index, arr) => {
      return index !== i
    })

    console.log(newArrayDeleted)
    updateArray = { ...updateArray, [name]: newArrayDeleted }
    setInputSocial(updateArray)
    setDataConfig(updateArray)
  }

  const insertInputFile = (e, name) => {
    e.preventDefault()
    let updateArray = { ...dataConfig }
    console.log(updateArray[name])
    if(name !== "textContentServices"){
    updateArray[name].push({
      "name": "new",
      "url": "http://www.example.com"
    })
  }else{
    updateArray[name].push({
      "name": "new",
      "content": "example text"
    })
  }

    let newList = updateArray[name]
    console.log('newList', newList)
    updateArray = { ...updateArray, [name]: newList }
    console.log('updateArray', updateArray, updateArray[name])
    setDataConfig(updateArray)
    console.log("update social", inputSocial)
  }

  const addFieldConfig = (e, node) => {
    let inputField = document.createElement('input')
    let list = document.getElementsByClassName("listChild")[0]
    console.log("input", inputField)
    const insertFieldAbove = list.insertBefore(inputField, list.childNodes[0])
    return insertFieldAbove
  }

  const saveList = () => {
    const cloneArray = { ...dataConfig }
    setDataConfig(cloneArray)
  }

  const updateImageLogo = (classInputFile, name) => {
    let updateArray = { ...dataConfig }
    console.log("name", classInputFile)
    let getEl = document.getElementsByClassName(`${classInputFile}`)[0]
    let getValue = getEl.getAttribute("value")
    let urlLogo = getValue
    updateArray = { ...updateArray, [classInputFile]: urlLogo }
    setDataConfig(updateArray)
  }

  const notifySuccess = () => {
    toast.success("success", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  console.log(isUserAdmin)
  return (
    <themeContextUser.Consumer>
      {({ userConnected }) => (
        <themeContext.Provider value={{
          onUrl: getUrlSaved
        }}>
          <themeContext.Consumer>
            {({ onUrl }) => (
              <Layout dashboard>
                <Head>
                  <title>{siteTitle}</title>
                </Head>
                <ToastContainer />
                {isUserAdmin &&
                  <div className="dash_container">
                    <form>
                      {labelInputItem.map((inputConfig, i) => (
                        <div key={i}>
                          {(inputConfig === "bottomImageUrl" ||
                            inputConfig === "topImageUrl" ||
                            inputConfig === "logoSiteUrl" ||
                            inputConfig === "logoSiteImageUrl") &&
                            <div>
                              <UploadFile
                                imageExist={dataConfig[inputConfig] ? true : true}
                                nameFile={inputConfig}
                                callBack={notifySuccess}
                                onGet={dataConfig[inputConfig]}
                                getUrlImage={(e) => {
                                  updateImageLogo(inputConfig)
                                }} />
                            </div>
                          }
                          {
                            (inputConfig === "textContentAbout") &&
                            <>
                            <label className="label" htmlFor={inputConfig}>
                              {inputConfig}
                            </label>
                            <Editor
                              apiKey="n20l3oxsnnev0ao8wjw8bqhpou0jajpz8ew2r3pysqf0mxgn"
                              initialValue={dataConfig[inputConfig]}
                              tagName={inputConfig}
                              textareaName={inputConfig}
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
                            </>
                          }
                          {inputConfig === "textContentServices" &&
                            <>
                              <div className="listChild">
                                {dataConfig[inputConfig].map((item, i) => (
                                  <Input
                                    key={i}
                                    value={item.name}
                                    url={item.url}
                                    nameReference={inputConfig}
                                    i_content={dataConfig[inputConfig][i].content}
                                    i_name={dataConfig[inputConfig][i].name}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      deleteItem(i, inputConfig)
                                    }}
                                    onChange={(e) => { handleChangeSocial(i, inputConfig, e.target) }}
                                  />
                                ))}
                              </div>
                              <Button.Group
                                hasAddons={false}
                                position='centered'
                                size='medium'
                                style={{ width: '100%', paddingTop: "15px" }}
                              >
                                <Button
                                  color="info"
                                  onClick={(e) => {
                                    insertInputFile(e, inputConfig)
                                  }}>Add field</Button>
                                <Button
                                  color="success"
                                  style={{ marginRight: "15px" }}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    saveList()
                                  }}>save</Button>
                              </Button.Group>
                            </>
                          }
                          {(inputConfig === "socialLink" ||
                            inputConfig === "menuCategoryLink") &&
                            <>
                              <div className="listChild">
                                {dataConfig[inputConfig].map((item, i) => (
                                  <Input
                                    key={i}
                                    value={item.name}
                                    url={item.url}
                                    nameReference={inputConfig}
                                    i_name={dataConfig[inputConfig][i].name}
                                    i_url={dataConfig[inputConfig][i].url}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      deleteItem(i, inputConfig)
                                    }}
                                    onChange={(e) => { handleChangeSocial(i, inputConfig, e.target) }}
                                  />
                                ))}
                              </div>
                              <Button.Group
                                hasAddons={false}
                                position='centered'
                                size='medium'
                                style={{ width: '100%', paddingTop: "15px" }}
                              >
                                <Button
                                  color="info"
                                  onClick={(e) => {
                                    insertInputFile(e, inputConfig)
                                  }}>Add field</Button>
                                <Button
                                  color="success"
                                  style={{ marginRight: "15px" }}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    saveList()
                                  }}>save</Button>
                              </Button.Group>
                            </>
                          }

                          {inputConfig !== "socialLink" &&
                            inputConfig !== "menuCategoryLink" &&
                            inputConfig !== "textContentServices" &&
                            inputConfig !== "logoSiteUrl" &&
                            inputConfig !== "logoSiteImageUrl" &&
                            inputConfig !== "textContentAbout" &&
                            inputConfig !== "bottomImageUrl" &&
                            inputConfig !== "topImageUrl" &&
                            <InputConfig
                              name={inputConfig}
                              defaultValue={dataConfig[inputConfig]}
                              onChange={(e) => {
                                handleChange(i, e.target)
                              }}
                              type="text"
                            />
                          }
                        </div>
                      ))}
                      <Field style={{
                        position: 'fixed',
                        bottom: '0',
                        left: '0',
                        width: '100%',
                        padding: '15px',
                        background: '#fff'
                      }} kind="group">
                        <Button.Group
                          hasAddons={false}
                          position='centered'
                          size='medium'
                          style={{ width: '100%' }}
                        >
                          <Button color="success" style={{ marginRight: "15px" }} onClick={(event) => { submitForm(event) }}>Sauvegarder</Button>
                          <Button color="info" onClick={(event) => { updateConfig(event) }}>Update</Button>
                        </Button.Group>
                      </Field>
                    </form>
                  </div>}
                {!isUserAdmin && (<div><p>Not authorized</p></div>)}
              </Layout>)}
          </themeContext.Consumer>
        </themeContext.Provider>
      )}
    </themeContextUser.Consumer>
  )
}