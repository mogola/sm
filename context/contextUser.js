/* global localStorage */
import React from 'react'
const { sign, verify, decode } = require('../helpers/jwt')

const ISSERVER = typeof window === "undefined";

export function config(data){
    return data
}


export function configData(data){
    return data
}

export function getDataFromLocalStorage(){
    if (!ISSERVER) {
        if(localStorage.getItem("info") === null || localStorage.getItem("info") === undefined){
            console.log('notdata user')
            return false;
        } else {
            let dataFromStorage = JSON.parse(localStorage.getItem("info"))
            return dataFromStorage
        }
    }
}

export function connected() {
    if (!ISSERVER) {
        console.log('ready', localStorage.getItem("info"), typeof (localStorage.getItem('userIsConnected')))
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

export function getAllCategory(allPost, idParam){
    console.log(allPost, idParam);
    if(idParam !== undefined || idParam === ''){
        console.log('getpost')
        console.log(idParam, allPost, Array.isArray(allPost))
        const postId = allPost.filter(post => post._id === idParam)
        console.log(postId, typeof postId );
        return postId;
    }else {
        return allPost
    }
}  

export const themeContextUser = React.createContext({
    getToken: tokenStorage,
    isConnected: userIsConnected,
    userConnected: connected,
    dataConfig: config,
    postsCategory: getAllCategory,
    getDataFromLocal : getDataFromLocalStorage,
    toggleTheme: () => {
        console.log('default click')
    }
});