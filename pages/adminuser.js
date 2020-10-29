import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import InputField from '../components/InputField'
import fetch from 'node-fetch'
import Layout, { siteTitle } from '../components/layout'
import baseUrl from '../helpers/baseUrl'
import { themeContextUser } from '../context/contextUser'
import { useRouter } from 'next/router'
import {getAllUserList} from './api/home'
import { Form } from 'react-bulma-components';
import SelectRole from '../components/SelectRole'

export async function getStaticProps() {
    const dataUser = await getAllUserList()
    // const allUser = await fetch(`${baseUrl}/api/login/admin`, { method: 'GET'})
    // const dataUser = await allUser.json()

console.log('allUser', dataUser)

return {
    props: {
        users : JSON.parse(JSON.stringify(dataUser))
    },
    revalidate: 1, // In secondes
  }
}

export default function Adminuser({users}) {
const [getAllUser, setGetAllUser] = useState(users)
const [userToUpdate, setUserToUpdate] = useState({})
const [listRole, setListRole] = useState(['visitor', 'superadmin', 'admin', 'moderator', 'user', ])

useEffect(() => {
}, [])
  const submitForm = async (e) => {
    e.preventDefault()
    try{
      await fetch(`${baseUrl}/api/login/admin`, {
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
          },
          body:JSON.stringify(userToUpdate)
      })
    }
    catch(err){
      console.log(err)
    }
  }

  const onChange = (i,target) => {
    console.log(target.value)
    userObj(i,target)
  }

  const userObj = (i, target) => {
    let user = [...getAllUser]
    let currentUser = user[i]
    currentUser = {...currentUser, role: target.value}
    user[i] = currentUser
    setUserToUpdate(currentUser)
    console.log(userToUpdate)
    //setGetAllUser(user)
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div>
      {getAllUser.map((user, i) => (
        <div key={i}>
          <div>{user.email}</div>
          <div>Role : <b>{user.role}</b></div>
          <SelectRole role={listRole} key={i} onChange={(e) => {
            onChange(i, e.target)
          }} />
          <button onClick={(e) => {
            submitForm(e)
            console.log('update user')
          }}>Save</button>
        </div>
      ))}
      </div>
      <form onSubmit={submitForm}>
      </form>
    </Layout>
  )
}