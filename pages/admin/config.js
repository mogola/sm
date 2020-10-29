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
import UploadFile from './../../helpers/upload'
import { getPostConfig } from '../api/home'
import {themeContext, getUrlSaved} from './../../context/context'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { themeContextUser } from './../../context/contextUser'

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

export default function config({config}) {
  console.log(config)
  const [labelInputItem, setInputItemLabel] = useState(Object.keys(config))
  const [dataConfig, setDataConfig] = useState(config)
  const [inputSocial, setInputSocial] = useState(config["socialLink"])
  const refInput = Object.keys(dataConfig).map(x => useRef(null));

  useEffect(() => {
    localStorage.setItem("formData", dataConfig)
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

  const handleChange = (i, refInput) => {
    const cloneArray = {...dataConfig}
    console.log(refInput.name)
    cloneArray[refInput.name] = refInput.value

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
          {userConnected() &&
          <div className="dash_container">
            <form>
              {labelInputItem.map((inputConfig, i) => (
                <div key={i}>
                  <label htmlFor={inputConfig}>{inputConfig}</label>
                  {(inputConfig === "logoSiteUrl" ||
                  inputConfig === "logoSiteImageUrl") &&
                    <div>
                        <UploadFile
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
                    <button
                    onClick={(e) => {
                      insertInputFile(e)
                    }}>Add field</button>
                    <button
                    onClick={(e) => {
                      e.preventDefault()
                      saveList()
                    }}>save</button>
                  </>
                  }
                  {inputConfig !== "socialLink" &&
                  inputConfig !== "logoSiteUrl" &&
                  inputConfig !== "logoSiteImageUrl" &&
                  <input
                      name={inputConfig}
                      ref={refInput[i]}
                      value={dataConfig[inputConfig]}
                      onChange={() => {
                        handleChange(i, refInput[i].current)
                      }}
                      type="text"
                  />
                    }
                </div>
              ))}
              <button onClick={(event)=> {submitForm(event)}}>Sauvegarder</button>
              <button onClick={(event)=> {updateConfig(event)}}>Update</button>
            </form>
          </div>}
          {!userConnected() && (<div><p>Not authorized</p></div>)}
        </Layout>)}
        </themeContext.Consumer>
      </themeContext.Provider>
     )}
    </themeContextUser.Consumer>
  )
}