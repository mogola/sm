import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import baseUrl from '../../helpers/baseUrl'
import Link from 'next/link'
import fetch from 'node-fetch'

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

export async function getStaticProps() {
const list = await fetch(`${baseUrl}/api/collection`, {method:"GET"})
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
const refCategory = useRef(null)
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
    fetch(`${baseUrl}/api/collection`, {
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
  useEffect(() => {
      console.log("get collection name", collection)
  }, [])

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <ToastContainer />
      <form>
      <div>
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
        </div>
        <div>
          <ul>
            {getCollections.map((item, i) => (
              <li key={i}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </form>
    </Layout>
  )
}