import { useState, useEffect } from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import InputField from '../components/InputField'
import Layout, { siteTitle } from '../components/layout'
import {RouterTracking} from '../components/router/ngprogress'
import baseUrl from '../helpers/baseUrl'
import {getPostConfig } from './api/home'
import Menu from './../components/home/Menu'
import Footer from './../components/home/Footer'
import Prestation from './../components/home/Prestation'
import { motion } from 'framer-motion';
import utilStyles from '../styles/utils.module.css'

import { Button, Container, Content, Image, Media, Card, Heading, Box, Loader, Tag, Form, Columns } from 'react-bulma-components';
const {Field, Control, Label, Help} = Form;

var CryptoJS = require("crypto-js");
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
const {sign, verify, decode } = require('../helpers/jwt')


export async function getStaticProps() {
    const config = await getPostConfig()

    return {
        props: {
            config: JSON.parse(JSON.stringify(config[0])),
        },
        revalidate: 1, // In secondes
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

export default function Register({ connect, config}) {

const [emailValue, setEmailValue] = useState();
const [obj, setObj] = useState({});
const [regexEmail, setRegexEmail] = useState(new RegExp('^[a-z0-9.-]+@[a-z.]{2,}\.[a-z]$'))
const [regexPwd, setRegexPwd] = useState(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$'))
const [validator, setValidator] = useState(true)
const [validatorPwd, setValidatorPwd] = useState(true)
const [errorMessage, setErrorMessage] = useState(false)
const [matchPwd, setMatchPwd] = useState(false)
const [emailExisting, setEmailExisting] = useState(false)

    useEffect(() => {
        // RouterTracking(router)
    }, [])

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            let body = formVerify()
            let privateKey = 'secret key 123'
            const cryptoPassword = CryptoJS.AES.encrypt(body.password, privateKey).toString()
            body = {...body, password: cryptoPassword, newpassword: cryptoPassword }

        //  console.log(verify(sign({email: body.email}, body), body))
        //  console.log(decode(sign({email: body.email}, body)))
        //     let i  = 'Mogola sangare';          // Issuer
        //     let s  = 'mogola.sangare@gmail.com';        // Subject
        //     let a  = cryptoPassword; // Audience

        //     let verifyOptions = {
        //         issuer:  i,
        //         subject:  s,
        //         audience:  a,
        //         expiresIn:  "12h"
        //     };

        //    // let token = jwt.sign({email: body.email}, privateKey, verifyOptions);
        //     let legit = jwt.verify({email: body.email}, privateKey, verifyOptions);
        //     console.log("\nJWT verification result: " + JSON.stringify(legit))
        //     console.log(token)
            // var bytes  = CryptoJS.AES.decrypt(cryptoPassword, 'secret key 123');
            // var originalText = bytes.toString(CryptoJS.enc.Utf8);

            //console.log(body, originalText);
            await apiUpload(`${baseUrl}/api/register/account`, 'POST', body)
        }
        catch(err){
            console.log('err', err)
        }
    }

    const apiUpload = (url, method, contentBody) => {
        fetch(url,{
            method:method,
            headers:{
            'Content-Type':'application/json'
            },
            body:JSON.stringify(contentBody)
        })
        .then(userInfo => {
            const result = userInfo.json()
            result.then(async (data) => {
                console.log("user", data)
                if(data.success === true){
                    notifySuccess()
                    localStorage.setItem('token', data.token);
                }
                // code mongodb if email existing
                if(data.code === 11000){
                    setEmailExisting(true)
                    setValidator(false)
                }else{
                    setEmailExisting(false)

                    await fetch(`${baseUrl}/api/email/accountcreated`, {
                        method:"POST",
                        headers: {
                            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
                            'api-key': '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',
                            'accept': 'application/json',
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(contentBody)
                    })
                }
            })
        })
        .catch(err => {
            console.log("error", err)
        })
    }

    const formVerify = () => {
        let addObj = obj

        //verify match password
        let email = obj.email
        let password = obj.password
        let newpassword = obj.newpassword

        if(password === newpassword &&
            (password === undefined || password.length) !== 0 &&
            (newpassword === undefined || newpassword.length) !== 0 &&
            regexEmail.test(email)){
            setMatchPwd(true)
        }else{
            setMatchPwd(false)
        }

        return obj
    }

  const onChange = ({target}) => {
    let addObj = {...obj, [target.name]: target.value}

    if(target.name === "email"){
        if(regexEmail.test(target.value)){
            setValidator(true)
        }
        else{
            setValidator(false)
        }
    } else {
        if(regexPwd.test(target.value)){
            setValidatorPwd(true)
            setErrorMessage(false)
        }
        else{
            setValidatorPwd(false)
            setErrorMessage(true)
        }
    }

    //verify match password
    let email = addObj.email
    let password = addObj.password !== undefined ? addObj.password : ""
    let newpassword = addObj.newpassword !== undefined ? addObj.newpassword : ""

    console.log("isEmpty", password)
    if(password === newpassword &&
        (password.length) !== 0 &&
        (newpassword.length) !== 0 &&
        regexEmail.test(email)){
        setMatchPwd(true)
    }else{
        setMatchPwd(false)
    }

    setObj(addObj)
}

const notifySuccess = () => {
    toast.success("Votre compte à été crée", {
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
    <motion.div
        style={{backgroundImage: `url(${config.logoSiteUrl})`}}
        variants={imageVariants}
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
            classMenu="fixedMenu"
        />
        <motion.div
        variants={loginVariants}
        initial="enter"
        animate="enter"
        exit="exit">
        <Container className="contentLogin" fluid>
            <Control className="innerLoginContent">
      <form>
      {emailExisting &&
      <Field kind="group"><Help style={{fontSize: "19px", fontWeight: "bold"}} className={"is-danger"}>Email déjà utilisé</Help></Field>}
          <InputField
            onChange={onChange}
            labelName="email"
            name="email"
            type="email"
            placeholder="email"
            classValidator={validator ? "is-success" : "is-danger" }
        />
        <InputField
            onChange={onChange}
            labelName="New Password"
            name="password"
            type="password"
            placeholder="password"
            booleanerror={errorMessage}
            classValidator={validatorPwd ? "is-success" : "is-danger"}
        />
        <InputField
            onChange={onChange}
            labelName="Password"
            name="newpassword"
            type="password"
            placeholder="password"
        />
        {matchPwd && <Field kind="group"><Help className={"is-success"}>Les mots de passes sont identiques</Help></Field>}
        {!matchPwd && <Field kind="group"><Help className={"is-danger"}>Les mots de passes ne sont pas identiques</Help></Field>}
        <Field kind="group">
            <Control>
                <button onClick={(e) => {
                    submitForm(e)
                }} disabled={matchPwd ? false : true} className="button" tabIndex="0" type="primary">Envoyer</button>
            </Control>
            <Control>
                <button className="is-link button" tabIndex="0" type="primary">Cancel</button>
            </Control>
        </Field>
      </form>
      </Control>
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
    </motion.div>
  )
}