import Head from 'next/head'
import Link from 'next/link'
import fetch from 'node-fetch'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import Layout, { siteTitle } from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import styles from '../../components/layout.module.css'
import Input from '../../components/Input'
import InputConfig from '../../components/InputConfig'
import UploadFile from './../../helpers/upload'
import { getPostConfig } from '../api/home'
import {themeContext, getUrlSaved} from './../../context/context'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { themeContextUser } from './../../context/contextUser'
import { Button, Heading, Box, Loader, Tag, Form, Column } from 'react-bulma-components';

const {Field, InputFile, Control} = Form
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
  try{
    const res =  await fetch(`${baseUrl}/api/homeconfig`,{
        method:"POST",
        headers:{
        'Content-Type':'application/json'
        },
        body:JSON.stringify({config:config})
      })
      .then((res) => {
          console.log('post is added')
          const data = res.json()
          data.then(() => {
            if(data.success){
              // call function
              return ""
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

export default function config({config, connect}) {
  console.log(config)
  const [labelInputItem, setInputItemLabel] = useState(Object.keys(config))
  const [dataConfig, setDataConfig] = useState(config)
  const [inputSocial, setInputSocial] = useState(config["socialLink"])
  const refInput = Object.keys(dataConfig).map(x => useRef(null));
  const [isUserAdmin, setIsUserAdmin] = useState()

  useEffect(() => {
    localStorage.setItem("formData", dataConfig)
    setIsUserAdmin(connect)
  }, [dataConfig])


  const submitForm = async (event) => {
    event.preventDefault();
    try {
      await addConfig(config)
    }
    catch(err){
      console.log(err)
    }
  }

  const handleChangeSocial = (i, refInput) => {
    const cloneArray = {...dataConfig}
    console.log(cloneArray["socialLink"][i].name)
    console.log("get current value", document.querySelectorAll("[i_name]")[i].value)
    let refInputName, refInputUrl;

    refInputName = document.querySelectorAll("[i_name]")[i].value
    refInputUrl = document.querySelectorAll("[i_url]")[i].value

    console.log(refInputName, refInputUrl)
    cloneArray["socialLink"][i].name = refInputName
    cloneArray["socialLink"][i].url = refInputUrl

    setDataConfig(cloneArray)
    console.log("currentValue", cloneArray)
  }

  const handleChange = (i, target) => {
    const cloneArray = {...dataConfig}
    console.log(target.name)
    cloneArray[target.name] = target.value

    setDataConfig(cloneArray)
    console.log(dataConfig)
  }
  const updateConfig = async (e) => {
    e.preventDefault()

    try{
      const res =  await fetch(`${baseUrl}/api/homeconfig`,{
        method:"PUT",
        headers:{
        'Content-Type':'application/json'
        },
        body:JSON.stringify({"config":dataConfig})
      })
      .then((res) => {
        console.log("updating", dataConfig)
        setDataConfig(dataConfig)
        notifySuccess()
        })
        .catch((err) => {
          console.log("error during udpdating",err)
        });
      }
      catch(err){
        console.log(err)
      }
  }
  const deleteItem = (i) => {
      let updateArray = {...dataConfig}
      const arrayToDelete = [...inputSocial]
      let newArrayDeleted = arrayToDelete.filter((value, index, arr) => {
        return index !== i
      })

      updateArray = {...updateArray, socialLink: newArrayDeleted}
      setInputSocial(newArrayDeleted)
      setDataConfig(updateArray)
  }

  const insertInputFile = (e) => {
    e.preventDefault()
    let updateArray = {...dataConfig}
    console.log(updateArray.socialLink)
    updateArray.socialLink.push({
      "name":"new",
      "url":"http://www.example.com"
    })

    let newList = updateArray.socialLink
    console.log('newList', newList)
    updateArray = {...updateArray, socialLink: newList}
    console.log('updateArray', updateArray, updateArray["socialLink"])
    setDataConfig(updateArray)
    console.log("update social", inputSocial)
  }

  const addFieldConfig = (e, node) => {
    let inputField = document.createElement('input')
    let list = document.getElementsByClassName("listChild")[0]
    console.log("input", inputField)
    const insertFieldAbove = list.insertBefore(inputField,list.childNodes[0])
    return insertFieldAbove
  }

  const saveList = () =>{
    const cloneArray = {...dataConfig}
    setDataConfig(cloneArray)
  }

  const updateImageLogo = (classInputFile, name) => {
    let updateArray = {...dataConfig}
    console.log("name", classInputFile)
    let getEl = document.getElementsByClassName(`${classInputFile}`)[0]
    let getValue = getEl.getAttribute("value")
    let urlLogo = getValue
    updateArray = {...updateArray, [classInputFile]: urlLogo}
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
                  {(inputConfig === "logoSiteUrl" ||
                  inputConfig === "logoSiteImageUrl") &&
                    <div>
                        <UploadFile
                        imageExist={dataConfig[inputConfig] ? true : false}
                        nameFile={inputConfig}
                        callBack={notifySuccess}
                        onGet={dataConfig[inputConfig]}
                        getUrlImage={(e) => {
                          updateImageLogo(inputConfig)
                        }}/>
                    </div>
                  }
                  {inputConfig === "socialLink" &&
                  <>
                  <div className="listChild">
                    {inputSocial.map((item, i) => (
                      <Input
                        key={i}
                        value={item.name}
                        url={item.url}
                        i_name="true"
                        i_url="true"
                        onClick={() => {deleteItem(i)}}
                        onChange={(e) => {handleChangeSocial(i, e.target)}}
                        />
                    ))}
                  </div>
                  <Button.Group
                    hasAddons= {false}
                    position='centered'
                    size='medium'
                    style={{width: '100%', paddingTop: "15px"}}
                  >
                    <Button
                    color="info"
                    onClick={(e) => {
                      insertInputFile(e)
                    }}>Add field</Button>
                    <Button
                    color="success"
                    style={{marginRight:"15px"}}
                    onClick={(e) => {
                      e.preventDefault()
                      saveList()
                    }}>save</Button>
                  </Button.Group>
                  </>
                  }
                  {inputConfig !== "socialLink" &&
                  inputConfig !== "logoSiteUrl" &&
                  inputConfig !== "logoSiteImageUrl" &&
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
                  style={{width: '100%'}}
                >
                  <Button color="success" style={{marginRight:"15px"}} onClick={(event)=> {submitForm(event)}}>Sauvegarder</Button>
                  <Button color="info" onClick={(event)=> {updateConfig(event)}}>Update</Button>
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