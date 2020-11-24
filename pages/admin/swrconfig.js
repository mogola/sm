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
import useSWR from 'swr'

// export async function getStaticProps() {
//   const { data, error } = useSWR('api/homeconfig', fetcher)

//   // const config = await fetch(`${baseUrl}/api/homeconfig`, {method:"GET"})
//   // const data = await config.json()
//   console.log('config', data)
//   return {
//     props: {
//       config: JSON.parse(JSON.stringify(data[0]))
//     }
//   }
// }

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

async function fetcher() {
  const res =  await fetch(`${baseUrl}/api/homeconfig`, { method:"GET" })
  return res.json()
}

export default function config() {
  const [labelInputItem, setInputItemLabel] = useState()
  const { data, error } = useSWR('api/homeconfig', fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  console.log('data',data)
  setInputItemLabel(data)
  // const [dataConfig, setDataConfig] = useState()
  // const [inputSocial, setInputSocial] = useState()
  // const refInput = Object.keys(data.map(x => useRef(null)));

  // useEffect(() => {
  //   setInputItemLabel(data)
  //   console.log(labelInputItem)
  //   localStorage.setItem("formData", data)
  // }, [data])


  // const submitForm = async (event) => {
  //   event.preventDefault();
  //   try {
  //     await addConfig(data)
  //   }
  //   catch(err){
  //     console.log(err)
  //   }
  // }

  // const handleChangeSocial = (i, refInput) => {
  //   const cloneArray = {...dataConfig}
  //   console.log(cloneArray["socialLink"][i].name)
  //   console.log("get current value", document.querySelectorAll("[i_name]")[i].value)
  //   let refInputName, refInputUrl;

  //   refInputName = document.querySelectorAll("[i_name]")[i].value
  //   refInputUrl = document.querySelectorAll("[i_url]")[i].value

  //   console.log(refInputName, refInputUrl)
  //   cloneArray["socialLink"][i].name = refInputName
  //   cloneArray["socialLink"][i].url = refInputUrl

  //   setDataConfig(cloneArray)
  //   console.log("currentValue", cloneArray)
  // }


  // const handleChange = (i, refInput) => {
  //   const cloneArray = {...dataConfig}
  //   console.log(refInput.name)
  //   cloneArray[refInput.name] = refInput.value

  //   setDataConfig(cloneArray)
  //   console.log(dataConfig)
  // }
  // const updateConfig = async (e) => {
  //   e.preventDefault()

  //   try{
  //     const res =  await fetch(`${baseUrl}/api/homeconfig`,{
  //       method:"PUT",
  //       headers:{
  //       'Content-Type':'application/json'
  //       },
  //       body:JSON.stringify({"config":dataConfig})
  //     })
  //     .then((res) => {
  //       console.log("updating", dataConfig)
  //       setDataConfig(dataConfig)
  //       })
  //       .catch((err) => {
  //         console.log("error during udpdating",err)
  //       });
  //     }
  //     catch(err){
  //       console.log(err)
  //     }
  // }
  // const deleteItem = (i) => {
  //     let updateArray = {...dataConfig}
  //     const arrayToDelete = [...inputSocial]
  //     let newArrayDeleted = arrayToDelete.filter((value, index, arr) => {
  //       return index !== i
  //     })

  //     updateArray = {...updateArray, socialLink: newArrayDeleted}
  //     setInputSocial(newArrayDeleted)
  //     setDataConfig(updateArray)
  // }

  // const insertInputFile = (e) => {
  //   e.preventDefault()
  //   let updateArray = {...dataConfig}
  //   console.log(updateArray.socialLink)
  //   updateArray.socialLink.push({
  //     "name":"new",
  //     "url":"http://www.example.com"
  //   })

  //   let newList = updateArray.socialLink
  //   console.log('newList', newList)
  //   updateArray = {...updateArray, socialLink: newList}
  //   console.log('updateArray', updateArray, updateArray["socialLink"])
  //   setDataConfig(updateArray)
  //   console.log("update social", inputSocial)
  // }

  // const addFieldConfig = (e, node) => {
  //   let inputField = document.createElement('input')
  //   let list = document.getElementsByClassName("listChild")[0]
  //   console.log("input", inputField)
  //   const insertFieldAbove = list.insertBefore(inputField,list.childNodes[0])
  //   return insertFieldAbove
  // }

  // const saveList = () =>{
  //   const cloneArray = {...dataConfig}
  //   setDataConfig(cloneArray)
  // }

  return (
    <div></div>
    // <Layout dashboard>
    //   <Head>
    //     <title>{siteTitle}</title>
    //   </Head>
    //   <div className="dash_container">
    //     <form>
    //       {Object.keys(data).map((inputConfig, i) => (
    //         <div key={i}>
    //            {inputConfig}
    //           <label htmlFor={inputConfig}>{inputConfig}</label>
    //           {inputConfig === "logoSiteUrl" &&
    //             <div>
    //                 <UploadFile nameFile={inputConfig} />
    //                 <div>
    //                   <input defaultValue={inputConfig} name={inputConfig} />
    //               </div>
    //             </div>
    //           }
    //           {inputConfig === "socialLink" &&
    //           <>
    //           <div className="listChild">
    //             {data["socialLink"].map((item, i) => (
    //               <Input
    //                 key={i}
    //                 value={item.name}
    //                 url={item.url}
    //                 i_name="true"
    //                 i_url="true"
    //                 onClick={() => {deleteItem(i)}}
    //                 onChange={(e) => {handleChangeSocial(i, e.target)}}
    //                 />
    //             ))}
    //           </div>
    //             <button
    //             onClick={(e) => {
    //               insertInputFile(e)
    //             }}>Add field</button>
    //             <button
    //             onClick={(e) => {
    //               e.preventDefault()
    //               saveList()
    //             }}>save</button>
    //           </>
    //           }
    //           {inputConfig !== "socialLink" &&
    //           inputConfig !== "logoSiteUrl" &&
    //           <input
    //               name={inputConfig}
    //               ref={refInput[i]}
    //               value={inputConfig}
    //               onChange={() => {
    //                 handleChange(i, refInput[i].current)
    //               }}
    //               type="text"
    //           />
    //             }
    //         </div>
    //       ))}
    //       <button onClick={(event)=> {submitForm(event)}}>Sauvegarder</button>
    //       <button onClick={(event)=> {updateConfig(event)}}>Update</button>
    //     </form>
    //   </div>
    // </Layout>
  )
}