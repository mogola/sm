import React, { useState, useEffect, useRef} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import InputField from '../components/InputField'
import fetch from 'node-fetch'
import Layout, { siteTitle } from '../components/layout'
import baseUrl from '../helpers/baseUrl'
import { themeContextUser } from '../context/contextUser'
import { useRouter } from 'next/router'
import { getAllUserList } from './api/home'
import { Form } from 'react-bulma-components';
import SelectRole from '../components/SelectRole'

const { Control, Field, Label } = Form;
import { Button, Heading, Box, Loader, Tag } from 'react-bulma-components';

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

export async function getStaticProps() {
  const dataUser = await getAllUserList()
  // const allUser = await fetch(`${baseUrl}/api/login/admin`, { method: 'GET'})
  // const dataUser = await allUser.json()

  console.log('allUser', dataUser)

  return {
    props: {
      users: JSON.parse(JSON.stringify(dataUser))
    },
    revalidate: 1, // In secondes
  }
}

export default function Adminuser({ users, connect }) {
  const [getAllUser, setGetAllUser] = useState(users)
  const [userToUpdate, setUserToUpdate] = useState({})
  const [listRole, setListRole] = useState(['visitor', 'superadmin', 'admin', 'moderator', 'user'])
  const [isUserAdmin, setIsUserAdmin] = useState()
  let refSelect = getAllUser.map(x => useRef(null));
  const [refButton, setRefButton] = useState(React.createRef())
  const [onLoading, setOnLoading] = useState(false)
  const [indexUser, setIndexUser] = useState()
  const styleLoader = {
    width: 30,
    height: 30,
    border: '4px solid #3298dc',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    top: 15,
    right: 15
  }
  useEffect(() => {
    setIsUserAdmin(connect)
  }, [])

  const submitForm = async (e) => {
    e.preventDefault()
    setOnLoading(true)
    try {
      await fetch(`${baseUrl}/api/login/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userToUpdate)
      }).then(result => {
        let data = result.json()
        data.then(dataUser => {
          notifySuccess()
          console.log(dataUser)
        })
      })
    }
    catch (err) {
      notifyEchec()
      console.log(err)
    }
  }

  const onChange = (i, target) => {
    console.log(target.value)
    userObj(i, target)
  }

  const userObj = (i, target) => {
    let user = [...getAllUser]
    let currentUser = user[i]
    currentUser = { ...currentUser, role: target.value }
    user[i] = currentUser
    setUserToUpdate(currentUser)
    console.log(userToUpdate)
    setGetAllUser(user)
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

  const notifyEchec = () => {
    toast.error("Error during Save", {
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

  const ButtonSave = ({ target }) => {
    return (
    <Button className="button is-success" onClick={(e) => {
      submitForm(e)
      console.log('update user', target)
      setIndexUser(target)
    }}>Save</Button>
    )
  }

  console.log(isUserAdmin)
  return (
    <Layout portfolio>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div>
        <ToastContainer />
        <div>value: {isUserAdmin}</div>
        {isUserAdmin && <Field>
          <Control>
            {getAllUser.map((user, i) => (
              <div key={i}>
                <Box style={{ position: "relative", marginTop: 10, marginBottom: 10 }} >
                  {onLoading && i === indexUser && <Loader style={styleLoader} />}
                  <Heading>{user.email}</Heading>
                  <Label htmlFor={user.role}>
            {user.role && user.role !== "admin" && <>Role : <Tag color="info">{user.role}</Tag></>}
            {user.role === "admin" && <>Role : <Tag color="warning">{user.role}</Tag></>}
            </Label>
                  <Field kind="group">
                    <Control>
                      <div className="select is-primary">
                        <SelectRole
                          role={listRole}
                          key={i}
                          valueoption={user.role}
                          usercurrent={user.role}
                          defaultValue={user.role}
                          onChange={(e) => {
                            onChange(i, e.target)
                          }} />
                      </div>
                    </Control>
                    <Control>
                   <ButtonSave target={i}/>
                    </Control>
                  </Field>
                </Box>
              </div>
            ))}
          </Control>
        </Field>}
        {!isUserAdmin && <div>not Authorized</div>}
      </div>
      <form onSubmit={submitForm}>
      </form>
    </Layout>
  )
}