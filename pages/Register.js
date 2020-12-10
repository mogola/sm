import { useState, useEffect } from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import InputField from '../components/InputField'
import Layout, { siteTitle } from '../components/layout'
import {RouterTracking} from '../components/router/ngprogress'
import baseUrl from '../helpers/baseUrl'

import utilStyles from '../styles/utils.module.css'
import { Form } from 'react-bulma-components';

var CryptoJS = require("crypto-js");
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
const {sign, verify, decode } = require('../helpers/jwt')


export async function getStaticProps() {
  return {
    props: {}
  }
}

export default function Register({}) {

const {Field, Control, Label, Help } = Form;
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
        RouterTracking(router)
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
            result.then(data => {
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
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <ToastContainer />
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
    </Layout>
  )
}