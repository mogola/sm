import React, { useState, useEffect, useRef} from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import baseUrl from '../helpers/baseUrl'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import Menu from './../components/home/Menu'
import Footer from './../components/home/Footer'
import Prestation from './../components/home/Prestation'
import {getPostConfig, getAllPosts } from './api/home'
import { Button, Container, Content, Heading, Form, Columns } from 'react-bulma-components';
import { ToastContainer } from 'react-toastify';
import {useRouter} from 'next/router'
import { motion} from 'framer-motion'

const {Field, Label} = Form;

export async function getServerSideProps() {
    const getData = await fetch(`${baseUrl}/api/about`, {method:"GET"})
    const data = await getData.json()
    const config = await getPostConfig()
    const getPostData = await getAllPosts(6)

    return {
        props: {
          data: JSON.parse(JSON.stringify(data.data)),
          allPost:JSON.parse(JSON.stringify(getPostData)),
          config: JSON.parse(JSON.stringify(config[0])),
        }
      }
    }

export default function Contact({config, connect}) {
    const [configs, setConfigs] = useState(config)
    const [regexEmail, setRegexEmail] = useState(new RegExp('^[a-z0-9.-]+@[a-z.]{2,}\.[a-z]$'))
    const [state, changeState] = useState({})
    const [btndisabled, setBtnDisabled] = useState(true)
    const [errorsField, setErrorsField] = useState()
    const [validError, setValidError] = useState(["","","","",""])
    const [firstFocus, setFirstFocus] = useState(false)

    let refEmail = useRef()
    let refName = useRef()
    let refLastname = useRef()
    let refMessage = useRef()
    let refPhone = useRef()

    const imageVariants = {
        exit: { x: -300, opacity: 0.9,
            transition: {
            duration: 0.5,
            type: "tween",
            stiffness:100,
            bounce: 0.5,
            when: "afterChildren"
            } },
        enter: {
            x: 0,
            opacity: 1,
            transition: {
            duration: 0.5,
            type: "tween",
            stiffness: 100,
            bounce: 0.5
            }
        }
    };

    const errorsForm = () => {
        let getErrors = document.querySelectorAll('.error')

        if(!getErrors.length){
            setBtnDisabled(false)

        }else {
            setBtnDisabled(true)
        }
    }

    const submitForm = async (e) => {
        e.preventDefault()
        try{
          await fetch(`${baseUrl}/api/email/sendemail`, {
                method:"POST",
                headers: {
                    'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
                    'api-key': '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',
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(state)
            })
        }
        catch(err){
            console.log("error email")
        }
    }

    useEffect(() =>{
        if(refLastname.current && !firstFocus){
            refLastname.current.focus()
        }

        setErrorsField(document.querySelectorAll('.error'))
    }, [state])

  const onChange = ({target}) => {
    setFirstFocus(true)
    
    const {name, value} = target
    const indexInput = parseInt(document.querySelectorAll(`[name="${name}"]`)[0].getAttribute("index"))

    changeState({...state, [name] : value})
    displayError(indexInput, value)
    errorsForm()
  }

  const displayError = (targetIndex, refValue) => {
    let arrayO = validError
    
    if(refValue === "") {
        arrayO[targetIndex] = "error"
        setValidError(arrayO)
    }else {
        arrayO[targetIndex] = "valid"
        setValidError(arrayO)
    }
  }

  return (
    <motion.div
        variants={imageVariants}
        initial="exit"
        animate="enter"
        exit="exit">
        <Layout post>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <ToastContainer />
            <Menu
                state={config}
                connect={connect}
                classMenu="singleMenuNoHome contactMenu"
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
                                <input ref={refLastname}
                                className={`input required ${validError[0]}`}
                                type="text"
                                index={0}
                                onChange={onChange}
                                defaultValue={refLastname.current === undefined ? "" : refLastname.current.value} name="lastname" />
                                {validError[0] === "error" && <Content className="errorsText">
                                    <p> Veuillez remplir le champs</p>
                                </Content>}
                            </Field>
                            <Field>
                                <Label>Nom</Label>
                                <input ref={refName}
                                className={`input required ${validError[1]}`}
                                type="text"
                                index={1}
                                onChange={onChange}
                                defaultValue={refName.current === undefined ? "" : refName.current.value} name="name" />
                                {validError[1] === "error" && <Content className="errorsText">
                                    <p> Veuillez remplir le champs</p>
                                </Content>}
                            </Field>
                        </div>
                        <div className="columnField">
                            <Field>
                                <Label>Email</Label>
                                <input ref={refEmail}
                                className={`input required ${!regexEmail.test(state["email"]) ? "error" : "valid"}`}
                                type="email"
                                index={2}
                                onChange={onChange}
                                defaultValue={refEmail.current === undefined ? "" : refEmail.current.value} name="email" />
                                {(refEmail.current && !state[refEmail.current["name"]])  && <Content className="errorsText">
                                    <p> Veuillez remplir le champs</p>
                                </Content>}
                            </Field>
                            <Field>
                                <Label>Téléphone</Label>
                                <input ref={refPhone}
                                className={`input required ${validError[3]}`}
                                type="phone"
                                index={3}
                                onChange={onChange}
                                defaultValue={refPhone.current === undefined ? "" : refPhone.current.value} name="phone" />
                                {validError[3] === "error"  && <Content className="errorsText">
                                    <p> Veuillez remplir le champs</p>
                                </Content>}
                            </Field>
                        </div>
                        <div className="columnField">
                            <Field>
                                <Label>Message</Label>
                                <textarea ref={refMessage}
                                className={`textarea input required ${validError[4]}`}
                                onChange={onChange}
                                index={4}
                                defaultValue={refMessage.current === undefined ? "" : refMessage.current.value } name="message" />
                                {validError[4] === "error" && <Content className="errorsText">
                                    <p> Veuillez remplir le champs</p>
                                </Content>}
                            </Field>
                        </div>
                        <div className="columnField submitting">
                            <Field>
                                <Button
                                    disabled={btndisabled}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        submitForm(e)
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
                        <Heading className="titleSubContacts" size={4}>{configs.titleLocalisation}</Heading>
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
    </motion.div>
  )
}