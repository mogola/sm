import {useState, useEffect} from 'react'
import '../styles/global.scss'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css'
import { themeContextUser, tokenStorage, userIsConnected, connected, getAllCategory} from './../context/contextUser'
import { getPostConfig, getAllCategories } from './api/home'
import baseUrl from './../helpers/baseUrl'
import fetch from 'isomorphic-unfetch'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion';
import {RouterTracking} from './../components/router/ngprogress'
import { ToastContainer } from 'react-toastify';
export async function getStaticProps() {

  const [configRes, categoryRes] = await Promise.all([
    getPostConfig(),
    getAllCategories()
  ])

  const [configs, categories] = await Promise.all([
    configRes.json(),
    categoryRes.json()
  ])

  console.log(configs, categories)
  // try{
  //   config = await getPostConfig()
  // }
  // catch(err){
  //   console.log('error', err)
  // }
  
  console.log("state config ====================>", config); 
    return {
      props: {
        config: JSON.parse(JSON.stringify(configs[0])),
        allCats: JSON.parse(JSON.stringify(configs[0]))
      }
    }
  }

export default function App({ Component, pageProps, config, router, allCats }) {
    const {id} = router.query
  const [localStorageData , setLocalStorageData] = useState(config)
  const [allCatsGetting, setAllCatsGetting] = useState([])

  console.log(allCatsGetting)

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
  let allCategories;

  useEffect(() => {
    Promise.resolve(localStorage.getItem("info"))
  
    async function getCats() {
        try{
          allCategories = await fetch(`${baseUrl}/api/categories`, { method: "GET"})
          const allCategoriesRes = await allCategories.json()
          setAllCatsGetting(getAllCategory(allCategoriesRes, id))
        }
        catch(err){
          console.log(err)
        }
      }

      getCats();
  //  RouterTracking(routering.route)
  // console.log(allCats)
  console.log("all Getting", allCatsGetting, id)
  }, [id])

    return (
        <themeContextUser.Provider value={{
            getToken: tokenStorage,
            userIsConnected: userIsConnected,
            userConnected: connected,
            postsCategory: allCatsGetting,
            dataConfig: localStorageData
        }}>
            <themeContextUser.Consumer>
                {({userConnected, postsCategory}) => (
                    <AnimatePresence exitBeforeEnter={false}>
                      <ToastContainer />
                      <Component key={router.route} allCats={postsCategory} config={localStorageData} connect={userConnected()} {...pageProps} />
                    </AnimatePresence>
                )}
            </themeContextUser.Consumer>
        </themeContextUser.Provider>)
}