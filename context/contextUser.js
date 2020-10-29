/* global localStorage */
import React from 'react'
const {sign, verify, decode } = require('../helpers/jwt')

export function connected(){
    const ISSERVER = typeof window === "undefined";
    if(!ISSERVER) {
        console.log('ready')
        if(localStorage.getItem('userIsConnected') !== undefined){
            return localStorage.getItem('userIsConnected')
        }else {
            return false
        }
    }
}

export function getUrlSaved(url) {
    console.log(url)
    return url
}

export function tokenStorage(getLocalStorage, userTokenStorage) {

    if(userTokenStorage === undefined){
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

export function userIsConnected(userIsConnect){
    if(userIsConnect)
        return true
    else
        return false
}

export const themeContextUser = React.createContext({
    getToken: tokenStorage,
    isConnected : userIsConnected,
    userConnected: connected,
    toggleTheme: () => {
        console.log('default click')
    }
});