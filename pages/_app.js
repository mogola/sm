import {useState, useEffect} from 'react'
import '../styles/global.scss'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css'
import { themeContextUser, tokenStorage, userIsConnected, connected} from './../context/contextUser'
import { getPostConfig } from './api/home'
import baseUrl from './../helpers/baseUrl'
import fetch from 'isomorphic-unfetch'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion';
import {RouterTracking} from './../components/router/ngprogress'

export async function getServerSideProps(ctx) {
  console.log(ctx.req)
  const config = await getPostConfig()
    return {
      props: {
        config: JSON.parse(JSON.stringify(config[0]))
      }
    }
  }

export default function App({ Component, pageProps, config, router }) {
  const routering = useRouter()
  const [localStorageData , setLocalStorageData] = useState(config)

  let compareStorage = (initialStorage, newStorage) => {
    console.log("==================", initialStorage)
    console.log("xxxxxxxxxxxxxxxxxx", newStorage)
    if(initialStorage === JSON.stringify(newStorage))
    return true
    else
    return false
  }

  let dataStorage = (callback) => {
    console.log("callback", callback, typeof callback)
    return localStorage.getItem("info") !== null && compareStorage(localStorage.getItem("info"),callback) === true
    ? JSON.parse(localStorage.getItem("info"))
    : callback
  }

  const fetchData = async () => {
    console.log("getInfo", dataStorage(config))

  //   new Promise((resolve) => {
  //     resolve(dataStorage(config))
  // }).then(result => {
  //   console.log(result)
  //   console.log(compareStorage(localStorage.getItem("info"),result))
  //   if(compareStorage(localStorage.getItem("info"),result)){
  //     console.log("from localstorage")
  //     setLocalStorageData(localStorage.getItem("info"))
  //   }else{
  //     console.log("from server")
  //     localStorage.setItem("info", JSON.stringify(result))
  //     setLocalStorageData(JSON.stringify(result))
  //   }
  // })
}

  useEffect(() => {
  //  dataStorage(localStorageData)

  Promise.resolve(localStorage.getItem("info")).then(result => console.log("resulting", result))
  fetchData()



    console.log(routering, router)
      RouterTracking(routering.route)
      console.log(localStorageData)
      // if(localStorage.getItem("info") === null){
      //   console.log("from server")
      //   return ""
      // }else {
      //   console.log("from localstorage")
      //   setLocalStorageData(localStorage.getItem("info"))
      // }

      // if(localStorage.getItem("info") != )
  }, [])
    return (
        <themeContextUser.Provider value={{
            getToken: tokenStorage,
            userIsConnected: userIsConnected,
            userConnected: connected,
            dataConfig: localStorageData
        }}>
            <themeContextUser.Consumer>
                {({userConnected}) => (
                    <AnimatePresence exitBeforeEnter>
                      <Component key={router.route} config={localStorageData} connect={userConnected()} {...pageProps} />
                    </AnimatePresence>
                )}
            </themeContextUser.Consumer>
        </themeContextUser.Provider>)
}