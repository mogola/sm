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

export async function getServerSideProps() {
  const config = await getPostConfig()
  console.log(config)
    return {
      props: {
        config: JSON.parse(JSON.stringify(config[0]))
      }
    }
  }

export default function App({ Component, pageProps, config, router }) {
    return (
        <themeContextUser.Provider value={{
            getToken: tokenStorage,
            userIsConnected: userIsConnected,
            userConnected: connected,
            dataConfig: config
        }}>
            <themeContextUser.Consumer>
                {({userConnected}) => (
                    <AnimatePresence exitBeforeEnter>
                      <Component key={router.route} config={config} connect={userConnected()} {...pageProps} />
                    </AnimatePresence>
                )}
            </themeContextUser.Consumer>
        </themeContextUser.Provider>)
}