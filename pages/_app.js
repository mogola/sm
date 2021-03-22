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
try {
    const [configRes, categoryRes] = await Promise.all([
      getPostConfig(),
      getAllCategories()
    ])

    const [configs, categories] = await Promise.all([
      configRes.json(),
      categoryRes.json()
    ])

    console.log("get site info", configs, categories)
    console.log("state config ====================>", config); 
      return {
        props: {
          config: JSON.parse(JSON.stringify(configs[0])),
          allCats: JSON.parse(JSON.stringify(categories))
        }
      }
  }
  catch(err){
    console.log(err)
  }
}

export default function App({ Component, pageProps, config, router, allCats }) {
  const {id} = router.query
  const [localStorageData , setLocalStorageData] = useState(config)
  const [allCatsGetting, setAllCatsGetting] = useState([])

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
    
    let isBool = false

    async function getCats() {
        try{
          allCategories = await fetch(`${baseUrl}/api/categories`, { method: "GET"})
          const allCategoriesRes = await allCategories.json()
          setAllCatsGetting(getAllCategory(allCategoriesRes, id))
          isBool = true
        }
        catch(err){
          console.log(err)
        }
      }
      
      if(isBool !== false){
        getCats();
      }
  //  RouterTracking(routering.route)
  // console.log(allCats)
  console.log("all Getting", config, allCats, id)
  }, [id])


  console.log("all Getting", config, allCats, id)
    return (
        <themeContextUser.Provider value={{
            getToken: tokenStorage,
            userIsConnected: userIsConnected,
            userConnected: connected,
            postsCategory: allCatsGetting,
            dataConfig: config
        }}>
            <themeContextUser.Consumer>
                {({userConnected, postsCategory}) => (
                    <AnimatePresence exitBeforeEnter={false}>
                      <ToastContainer />
                      <Component key={router.route} allCats={postsCategory} config={config} connect={userConnected()} {...pageProps} />
                    </AnimatePresence>
                )}
            </themeContextUser.Consumer>
        </themeContextUser.Provider>)
}