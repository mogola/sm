/* global localStorage */
import React from 'react'
const { sign, verify, decode } = require('../helpers/jwt')

export function config(data){
    return data
}
export function connected() {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
        console.log('ready', typeof (localStorage.getItem('userIsConnected')))
        if (localStorage.getItem('userIsConnected') === null) {
            console.log('user not connect')
            return false
        } else {
            // console.log(decode(localStorage.getItem('token')))
            console.log('user connect')
            return true
        }
    }
}

export function getUrlSaved(url) {
    console.log(url)
    return url
}

export function tokenStorage(getLocalStorage, userTokenStorage) {

    if (userTokenStorage === undefined) {
        userTokenStorage = localStorage.getItem('token');
    }

    console.log("getitem", userTokenStorage)
    return new Promise((resolve) => {
        resolve(userTokenStorage)
    })
        .catch(err => {
            console.log('error', err)
        })
}

export function userIsConnected(userIsConnect) {
    if (userIsConnect)
        return true
    else
        return false
}

export const themeContextUser = React.createContext({
    getToken: tokenStorage,
    isConnected: userIsConnected,
    userConnected: connected,
    dataConfig: config,
    toggleTheme: () => {
        console.log('default click')
    }
});