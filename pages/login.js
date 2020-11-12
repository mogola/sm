import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import InputField from '../components/InputField'
import Layout, { siteTitle } from '../components/layout'
import baseUrl from '../helpers/baseUrl'
import { themeContextUser } from './../context/contextUser'
import { useRouter } from 'next/router'
import cookies from 'next-cookies'

import { Form } from 'react-bulma-components';

var CryptoJS = require("crypto-js");
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
const { sign, verify, decode } = require('../helpers/jwt')

export async function getStaticProps() {
    return {
        props: {},
        revalidate: 1, // In secondes
    }
}

export default function Login({ connect }) {
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
    const [isUserAdmin, setIsUserAdmin] = useState()

    useEffect(() => {
        console.log('test', connect, typeof (connect))
        setIsUserAdmin(connect)
    }, [])

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

                        const tokenItem = await callback
                        const payload = decode(itemStorage).payload
                        // console.log('console return', tokenItem, data.account.role)

                        // console.log("verifyAccount", payload.aud, payload.email)
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
                <Layout home>
                    <Head>
                        <title>{siteTitle}</title>
                    </Head>
                    <ToastContainer />
                    {isUserAdmin && <div>Vous êtes bien connecté</div>}
                    {!isUserAdmin && <div>Vous n'êtes pas connecté</div>}
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
                </Layout>)}
        </themeContextUser.Consumer>
    )
}