import { useState, useEffect, useRef, useLayoutEffect  } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import baseUrl from '../../helpers/baseUrl'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

import { Button, Container, Content, Image, Media, Card, Heading, Box, Loader, Tag, Form, Columns } from 'react-bulma-components';
const {Field, Control, Label} = Form;

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

export async function getServerSideProps() {
const list = await fetch(`${baseUrl}/api/collection/collection`, {method:"GET"})
const data = await list.json()
console.log("list", JSON.parse(JSON.stringify(data)))
return {
    props: {
      collection: JSON.parse(JSON.stringify(data.data))
    }
  }
}

export default function Collection({collection}) {
const [getName, setGetName] = useState('')
const [getCollections, setGetCollection] = useState(collection)
const [onLoading, setOnLoading] = useState(false)
const [getField, setGetField] = useState('')
const [getValue, setGetValue] = useState('')
const [modelData, setModelData] = useState({})
const [stringifyData, setStringifyData] = useState('')
const [collectionName, setCollectioName] = useState('')
const [stringifyManyData, setStringifyManyData] = useState('')
const [arrModel, setArrModel] = useState([])
const [objModel, setObjModel] = useState({})
const [valueCategory, setValueCategory] = useState()
const [addObj, setAddObj] = useState()
const refCategory = useRef(null)
const refValue = useRef(null)
const refKey = useRef(null)
const refCollection = useRef(null)
const refCategoryName = useRef(null)
  const submitForm = async (name) => {
    event.preventDefault
    let newList = [...getCollections]
    if(newList.includes(name)){
      notifyEchec()
      return false
    }
    newList.push(name)
    console.log(newList.includes(name))
    setGetCollection(newList)
    fetch(`${baseUrl}/api/collection/collection`, {
        method: "POST",
        headers:{
          'Content-Type':'application/json'
        },
        body : JSON.stringify({
            name: name
        })
    }).then(async (data) => {
      console.log(await data.json())
      notifySuccess()
    })
  }

  const udpateCollection = async () => {
    event.preventDefault
    console.log("modelSubmitdata", modelData)
    fetch(`${baseUrl}/api/collection/collection`, {
        method: "PUT",
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
            nameCollection: collectionName,
            obj: modelData, //objModel
            multiple: false
        })
    }).then(async (data) => {
      console.log(await data.json())
      notifySuccess()
    })
  }

  const udpateManyCollection = async () => {
    event.preventDefault
    fetch(`${baseUrl}/api/collection/collection`, {
        method: "PUT",
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
            nameCollection: collectionName,
            obj: objModel,
            multiple: true
        })
    }).then(async (data) => {
      console.log(await data.json())
      notifySuccess()
    })
  }

  const notifySuccess = (name) => {
    toast.success("collection ajouté", {
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
  const notifyEchec = () => {
    toast.error(`${name} collections already exist`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onOpen: () => {
        console.log("error")
        setOnLoading(false)
      }
    })
  }

  const reset = () => {
    setGetValue('')
    setGetField('')
  }

  const getNameCollection = ({target}) => {
    console.log(target.value)
    setCollectioName(target.value)
  }

  const addManyIndex =  async () => {
    try{
      event.preventDefault()
        if(refKey.current){
          let newDataItem = {[refKey.current.name]:refKey.current.value, [refValue.current.name]:refValue.current.value}
        // setObjModel({...objModel, newDataItem})
          setArrModel([...arrModel, newDataItem])
          // console.log("objModel", objModel)
          // console.log("arrModel", arrModel)
          await arrModel.forEach((keys) => {
            setAddObj({...addObj, [keys["fieldProp"]] : keys["valueProp"]})
          // console.log("addObj", addObj)
            //setObjModel({...dataModel, [keys["fieldProp"]] : keys["valueProp"]})
            //console.log('obj model',{[keys["fieldProp"]] : keys["valueProp"]}, objModel)

            // for (const [key, value] of Object.entries(keys)){
            //   console.log(`${key}: ${value}`);
            // }
          })

            setObjModel(addObj)
            setStringifyManyData(JSON.stringify(addObj))
            console.log("addObj", objModel)
      }
    }
    catch(err){
      console.log(err)
    }
  }

  const onChange = ({target}) => {
    setModelData({...modelData, [target.name]: target.value})
    setObjModel({...modelData, [target.name]: target.value})
    setStringifyData(JSON.stringify(modelData))
  }

  const onchangeCategoryName = () => {
    setValueCategory(refCategoryName.current.value)
  }

  const submitFormCategory = async (nameCat) => {
    try{
      await fetch(`${baseUrl}/api/category`, {
        method: "POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          nameCategory: nameCat
        })
      })
    }
    catch(err){
      console.log(err, "not connected")
    }
  }
  useEffect(() => {
    addManyIndex()
  }, [])

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <ToastContainer />
      <Field>
      <form>
        <select
        ref={refCollection}
        onChange={getNameCollection}
        className="select">
              {getCollections.map((item, i) => (
                <option key={i}>
                  {item}
                </option>
              ))}
          </select>
          <Columns>
            <Columns.Column>
            <Control>
                <Columns>
                  <Columns.Column>
                    <Container>
                        <Label>Key</Label>
                        <input ref={refKey}
                        className="input"
                        name="fieldProp"
                        type="input"
                        onChange={onChange}
                        defaultValue={getField}/>
                    </Container>
                    </Columns.Column>
                    <Columns.Column>
                      <Container>
                        <Label>Value</Label>
                        <input ref={refValue}
                        className="input"
                        name="valueProp"
                        type="input"
                        onChange={onChange}
                        defaultValue={getValue}/>
                      </Container>
                    </Columns.Column>
                  </Columns>
                  <Button onClick={(e) =>
                  {
                    e.preventDefault()
                    console.log("modelData", modelData)
                    udpateCollection()
                  }
                  }>add New Attribute</Button>
                  <Button type="submit" onClick={(e) => {
                        event.preventDefault()
                        let newDataItem = {[refKey.current.name]:refKey.current.value, [refValue.current.name]:refValue.current.value}
                        // setObjModel({...objModel, newDataItem})
                        // console.log("objModel", objModel)
                        // console.log("arrModel", arrModel)
                        setAddObj({...addObj, [refKey.current.value] : refValue.current.value})
                        // arrModel.forEach((keys) => {
                        //   setAddObj({...addObj, [keys["fieldProp"]] : keys["valueProp"]})
                        // console.log("addObj", addObj)
                          //setObjModel({...dataModel, [keys["fieldProp"]] : keys["valueProp"]})
                          //console.log('obj model',{[keys["fieldProp"]] : keys["valueProp"]}, objModel)

                          // for (const [key, value] of Object.entries(keys)){
                          //   console.log(`${key}: ${value}`);
                          // }
                        //})
                        setStringifyManyData(JSON.stringify(addObj))
                        setObjModel(addObj)
                        console.log("addObj",addObj)
                   // addManyIndex()
                  }}>add Multiple Attribute</Button>
                  <Button type="submit" onClick={(e) => {
                    e.preventDefault()
                       udpateManyCollection()
                  }}>Submit Object</Button>
              </Control>
            </Columns.Column>
            <Columns.Column>
              <div id="data">
                {stringifyData}
                <hr />
                {stringifyManyData}
              </div>
            </Columns.Column>
          </Columns>
          </form>
          <form>
          <input ref={refCategory}
            className="input"
            name="collection"
            type="input"
            defaultValue={getName}/>
          <button type="submit" className="button" onClick={(e) => {
              e.preventDefault()
              console.log(refCategory.current.value)
              submitForm(refCategory.current.value)
          }}>Envoyer</button>
          </form>
        </Field>
        <div>
          <ul>
            {getCollections.map((item, i) => (
              <li key={i}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <form>
          <Label>Nom de la category</Label>
          <input ref={refCategoryName} onChange={() => {
            onchangeCategoryName()
          }} type="text" value={valueCategory} name="nameCategory" />
          <Button className="submitCategory" onClick={(e) => {
            e.preventDefault()
            console.log(refCategoryName.current.value)
            submitFormCategory(refCategoryName.current.value)
          }}>
            Submit
          </Button>
        </form>
    </Layout>
  )
}