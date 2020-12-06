import React, { useState, useEffect, useRef, useLayoutEffect  } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import baseUrl from '../helpers/baseUrl'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import Menu from './../components/home/Menu'
import Footer from './../components/home/Footer'
import Prestation from './../components/home/Prestation'
import {getPostConfig, getAllPosts } from './api/home'
import Masonry from './../components/Masonry'
import { Button, Container, Content, Image, Media, Card, Heading, Box, Loader, Tag, Form, Columns } from 'react-bulma-components';
const {Field, Control, Label} = Form;
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

export async function getServerSideProps() {
    const getData = await fetch(`${baseUrl}/api/about`, {method:"GET"})
    const data = await getData.json()
    const config = await getPostConfig()
    const getPostData = await getAllPosts(6)

    console.log("data about", JSON.parse(JSON.stringify(data)))
    console.log("post", getPostData)
    return {
        props: {
          data: JSON.parse(JSON.stringify(data.data)),
          allPost:JSON.parse(JSON.stringify(getPostData)),
          config: JSON.parse(JSON.stringify(config[0])),
        }
      }
    }

export default function Contact({post, data, config, allPost, connect}) {
    const [getData, setGetData] = useState(data)
    const [configs, setConfigs] = useState(config)
    const [posts, setPosts] = useState(allPost)
    const [regexEmail, setRegexEmail] = useState(new RegExp('^[a-z0-9.-]+@[a-z.]{2,}\.[a-z]$'))
    const [state, changeState] = useState({})

    let refEmail = useRef()
    let refName = useRef()
    let refLastname = useRef()
    let refMessage = useRef()
    let refPhone = useRef()


    const submitForm = async () => {
        try{
          await fetch(`${baseUrl}/api/email/sendemail`, {
                method:"POST",
                headers: {
                    'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
                    'api-key': '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',
                    'accept': 'application/json',
                    'content-type': 'application/json'
                }
            })
        }
        catch(err){
            console.log("error email")
        }
    }

  useEffect(() =>{


  }, [state])
  const onChange = ({target}) => {
    const {name, value} = target
    changeState({...state, [name] : value})
    console.log("state change", state)
  }
  return (
    <Layout post>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <ToastContainer />
      <Menu
            state={config}
            connect={connect}
            classMenu="fixedMenu contactMenu"
        />
        <Container className="wrapperContact" fluid>

        <Columns className="ContactMain">
            <Columns.Column className="contentContact">
                <Heading>
                    Contact
                </Heading>
                <Content className="subTextContact">
                    <p>
                        Vous avez un projet et vous recherchez un illustrateur / designer textile freelance ? Contactez-moi, je suis disponible pour en discuter avec vous.
                    </p>
                </Content>
            <form className="formContactMs" onSubmit={submitForm}>
                <div className="columnField">
                    <Field>
                        <Label>Prénom</Label>
                        <input ref={refLastname} className="input required" type="text"
                        onChange={onChange}
                        defaultValue={refLastname.current === undefined ? "" : refLastname.current.value} name="lastname" />
                    </Field>
                    <Field>
                        <Label>Nom</Label>
                        <input ref={refName} className="input required" type="text"
                        onChange={onChange}
                        defaultValue={refName.current === undefined ? "" : refName.current.value} name="name" />
                    </Field>
                </div>
                <div className="columnField">
                    <Field>
                        <Label>Email</Label>
                        <input ref={refEmail} className={`input required ${regexEmail.test(state["email"]) ? "valid" : "error"}`} type="email"
                        onChange={onChange}
                        defaultValue={refEmail.current === undefined ? "" : refEmail.current.value} name="email" />
                    </Field>
                    <Field>
                        <Label>Téléphone</Label>
                        <input ref={refPhone} className="input required" type="phone"
                        onChange={onChange}
                        defaultValue={refPhone.current === undefined ? "" : refPhone.current.value} name="phone" />
                    </Field>
                </div>
                <div className="columnField">
                    <Field>
                        <Label>Message</Label>
                        <textarea ref={refMessage} className="textarea required"
                        onChange={onChange}
                        defaultValue={refMessage.current === undefined ? "" : refMessage.current.value } name="message" />
                    </Field>
                </div>
                <div className="columnField submitting">
                    <Field>
                        <Button onClick={(e) => {
                            e.preventDefault();
                            submitForm()
                        }}>
                            Envoyer le message <span className="icoRight"></span>
                        </Button>
                    </Field>
                </div>
      </form>
            </Columns.Column>
            <Columns.Column className="infoContactPage">
                <div className="ContainerInfo">
                <Columns className="contactsSection">
                <Columns.Column className="partContacts">
                    <Heading className="titleSubContacts" size={4}>{configs.textCategoryServices}</Heading>
                    <ul>
                        {configs.textContentServices.map((item, i) =>(
                            <li key={i}>
                            <Link href={item.name}>
                                <a>{item.name}</a>
                            </Link>
                        </li>
                        ))}
                    </ul>
                </Columns.Column>
                <Columns.Column className="partContacts">
                    <Heading className="titleSubContacts" size={4}>{configs.textFollowMe}</Heading>
                    <ul>
                        {configs.socialLink.map((item, i) =>(
                            <li key={i}>
                            <Link href={item.url}>
                                <a>{item.name}</a>
                            </Link>
                        </li>
                        ))}
                    </ul>
                </Columns.Column>
                <Columns.Column className="partContacts">
                    <Heading className="titleSubContacts" size={4}>{configs.textLocalisation}</Heading>
                    <ul>
                        <li>
                            <Link href="">
                                <a>{configs.textLocalisation}</a>
                            </Link>
                        </li>
                    </ul>
                </Columns.Column>
            </Columns>
                </div>
            </Columns.Column>
          </Columns>
        </Container>
      <Prestation
          data={configs.textContentServices}
          title={configs.textCategoryServices}
          className="section-prestation"
        />
        <Footer
          menu={configs.menuCategoryLink}
          data={configs}
          className="section-footer"
        />
    </Layout>
  )
}