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
import { ToastContainer } from 'react-toastify';
export async function getServerSideProps() {
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
    if(initialStorage === JSON.stringify(newStorage))
    return true
    else
    return false
  }

  let dataStorage = (callback) => {
    return localStorage.getItem("info") !== null && compareStorage(localStorage.getItem("info"),callback) === true
    ? JSON.parse(localStorage.getItem("info"))
    : callback
  }

  useEffect(() => {
    Promise.resolve(localStorage.getItem("info"))
    RouterTracking(routering.route)
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
                      <ToastContainer />
                      <Component key={router.route} config={localStorageData} connect={userConnected()} {...pageProps} />
                    </AnimatePresence>
                )}
            </themeContextUser.Consumer>
        </themeContextUser.Provider>)
}