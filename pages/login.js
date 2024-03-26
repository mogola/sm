import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import InputField from '../components/InputField'
import Layout, { siteTitle } from '../components/layout'
import {RouterTracking} from '../components/router/ngprogress'
import baseUrl from '../helpers/baseUrl'
import { themeContextUser } from './../context/contextUser'
import { useRouter } from 'next/router'
import Menu from './../components/home/Menu'
import Footer from './../components/home/Footer'
import Prestation from './../components/home/Prestation'
import cookies from 'next-cookies'
import { motion } from 'framer-motion';

var CryptoJS = require("crypto-js");
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

import { Button, Container, Content, Image, Media, Card, Heading, Box, Loader, Tag, Form, Columns } from 'react-bulma-components';
const {Field, Control, Label} = Form;

const { sign, verify, decode } = require('../helpers/jwt')

export async function getStaticProps() {
    try{
        const configs = await fetch(`${baseUrl}/api/data`, {method:"GET"})
        const getConfigs = await configs.json();
        
        return {
            props: {
                config: getConfigs[0],
            },
            revalidate: 1, // In secondes
        }
    }
    catch(err){
        console.log('error', err)
    }
}

let easing = [0.175, 0.85, 0.42, 0.96];

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

const loginVariants = {
    exit: { x: -150, opacity: 0.8, transition: { duration: 0.5, ease: easing } },
    enter: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easing,
        staggerChildren : 0.05
      }
    }
  };

export default function Login({ connect, config}) {
    const router = useRouter()
    const { Field, Control, Label, Help } = Form;
    const [emailValue, setEmailValue] = useState();
    const [obj, setObj] = useState({});
    const [regexEmail, setRegexEmail] = useState(new RegExp('^[a-z0-9.-]+@[a-z.]{2,}\.[a-z]$'))
    const [regexPwd, setRegexPwd] = useState(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$'))
    const [validator, setValidator] = useState(true)
    const [validatorPwd, setValidatorPwd] = useState(true)
    const [errorMessage, setErrorMessage] = useState(false)
    const [matchPwd, setMatchPwd] = useState(false)
    const [emailExisting, setEmailExisting] = useState(false)
    const [tokenUser, setTokenUser] = useState()
    const [userBody, setUserBody] = useState()
    const [userIsConnected, setUserIsConnected] = useState(false)
    const [isUserAdmin, setIsUserAdmin] = useState(false)

    useEffect(() => {
        setIsUserAdmin(connect)
    }, [isUserAdmin])

    const submitForm = async (e, callback) => {
        e.preventDefault();
        try {
            let body = formVerify();
            let userToken = sign({ email: body.email }, body)
            setTokenUser(userToken)
            setUserBody(body)
            await
            apiUpload(`${baseUrl}/api/login/account`, 'POST', body, callback)
        }
        catch (err) {
            console.log('err', err)
        }
    }

    const apiUpload = (url, method, contentBody, callback) => {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': tokenUser
            },
            body: JSON.stringify(contentBody)
        })
            .then(userInfo => {
                const result = userInfo.json()
                result.then(async data => {
                    if (data.success === true && data.account !== null) {
                        let itemStorage
                        if (localStorage.getItem('token') === null) {
                            let setToken = sign({ email: data.account.email }, data.account)
                            localStorage.setItem('token', setToken)
                            itemStorage = localStorage.getItem('token')
                        } else {
                            itemStorage = localStorage.getItem('token')
                        }

                        const payload = decode(itemStorage).payload
                        let tokenPwd = CryptoJS.AES.decrypt(payload.aud, 'secret key 123');
                        let loginPwd = CryptoJS.AES.decrypt(data.account.password, 'secret key 123');
                        let verifyPwd = tokenPwd.toString(CryptoJS.enc.Utf8);
                        let verifyPwdLogin = loginPwd.toString(CryptoJS.enc.Utf8);

                        if (verifyPwd === verifyPwdLogin &&
                            payload.email === data.account.email &&
                            data.account.role === "admin") {
                            notifySuccess()
                            setUserIsConnected(data.success)
                            setIsUserAdmin(data.success)
                            localStorage.setItem('userIsConnected', true)
                            document.cookie = `name=; path=/`;
                            document.cookie = `token=${localStorage.getItem('token')}; path=/`;

                            setTimeout(() => {
                                router.push(`/`)
                            }, 1500)

                        } else {
                            localStorage.removeItem("token")
                        }

                    } else {
                        notifyEchec()
                        setValidator(false)
                    }
                    // code mongodb if email existing
                    if (data.code === 11000) {
                        setEmailExisting(true)
                        setValidator(false)
                    } else {
                        setEmailExisting(false)
                    }
                })
            })
            .catch(err => {
                console.log("error", err)
            })
    }

    const formVerify = () => {
        return obj
    }

    const onChange = ({ target }) => {
        let addObj = { ...obj, [target.name]: target.value }

        if (target.name === "email") {
            if (regexEmail.test(target.value)) {
                setValidator(true)
            }
            else {
                setValidator(false)
            }
        } else {
            if (regexPwd.test(addObj.password)) {
                setErrorMessage(false)
                setValidatorPwd(false)
            } else {
                setErrorMessage(true)
                setValidatorPwd(true)
            }
        }

        if (regexEmail.test(addObj.email) && regexPwd.test(addObj.password)) {
            setMatchPwd(true)
        } else {
            setMatchPwd(false)
        }

        setObj(addObj)
    }

    const notifySuccess = () => {
        toast.success("Vous êtes connecté", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    const notifyEchec = () => {
        toast.error("user dont exist", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    return (
        <themeContextUser.Consumer>
            {({ getToken }) => (
                <motion.div
                    style={{backgroundImage: `url(${config.logoSiteUrl})`}}
                    variants={loginVariants}
                    className="motionWrapper loginWrapper"
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
                    />
                    <motion.div
                    variants={loginVariants}
                    initial="enter"
                    animate="enter"
                    exit="exit">
                    <Container className="contentLogin" fluid>
                        <div className="innerWrapperLogin">
                        <Heading className="titleMainLogin" size={3}>
                            Login
                        </Heading>
                        <Control className="innerLoginContent">
                            {isUserAdmin && <div className="txtInfoConnected">Vous êtes bien connecté</div>}
                            {!isUserAdmin && <div className="txtInfoConnected">Vous n'êtes pas connecté</div>}
                            <form onSubmit={(e) => {
                                let compareToken = getToken(localStorage.getItem('token'), tokenUser, userBody)
                                submitForm(e, compareToken)
                            }}>
                                <InputField
                                    onChange={onChange}
                                    labelName="email"
                                    name="email"
                                    type="email"
                                    placeholder="email"
                                    classValidator={validator ? "is-success" : "is-danger"}
                                />
                                <InputField
                                    onChange={onChange}
                                    labelName="Password"
                                    name="password"
                                    type="password"
                                    placeholder="password"
                                    booleanerror={errorMessage}
                                    classValidator={!errorMessage ? "is-success" : "is-danger"}
                                />
                                <Field kind="group">
                                    <Control>
                                        <button onClick={() => { }}
                                            disabled={matchPwd ? false : true}
                                            className="button"
                                            tabIndex="0"
                                            type="primary">Envoyer</button>
                                    </Control>
                                    <Control>
                                        <button className="is-link button" tabIndex="0" type="primary">Cancel</button>
                                    </Control>
                                </Field>
                            </form>
                        </Control>
                        </div>
                    </Container>
                    </motion.div>
                    <Prestation
                        data={config.textContentServices}
                        title={config.textCategoryServices}
                        className="section-prestation"
                    />
                    <Footer
                        menu={config.menuCategoryLink}
                        data={config}
                        className="section-footer"
                    />
                </Layout>
                </motion.div>)}
        </themeContextUser.Consumer>
    )
}