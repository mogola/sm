import {useState, useEffect} from 'react'
import '../styles/global.scss'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css'
import { themeContextUser, tokenStorage, userIsConnected, connected} from './../context/contextUser'
import { getPostConfig } from './api/home'
import baseUrl from './../helpers/baseUrl'
import fetch from 'node-fetch'

export async function getStaticProps() {
    const config = await getPostConfig()

    return {
      props: {
        config: JSON.parse(JSON.stringify(config[0]))
      },
      revalidate: 1, // In secondes
    }
  }

export default function App({ Component, pageProps, config }) {

    const [dataConfigs, setDataConfig] = useState()
    const [naming, setNaming] = useState()

      const getData = async () => {
          const getData = await fetch(`${baseUrl}/api/homeconfig`)
          const data = await getData.json()

          new Promise((resolve) => {
            resolve(data)
          }).then(result => {
            console.log(result, result.nameSite, result.logoSiteUrl)
            setNaming(result.nameSite)
            setDataConfig(data)
          })
        }

        useEffect(()=>{
          getData()
          console.log("get data", dataConfigs)
        }, [])
    return (
        <themeContextUser.Provider value={{
            getToken: tokenStorage,
            userIsConnected: userIsConnected,
            userConnected: connected,
            dataConfig: dataConfigs
        }}>
            <themeContextUser.Consumer>
                {({userConnected}) => (
                    <Component config={dataConfigs} connect={userConnected()} {...pageProps} />
                )}
            </themeContextUser.Consumer>
        </themeContextUser.Provider>)
}