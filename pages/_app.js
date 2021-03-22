import {useState, useEffect, useCallback} from 'react'
import '../styles/global.scss'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css'
import { themeContextUser, tokenStorage, userIsConnected, connected, configData, getAllCategory} from './../context/contextUser'
import { getPostConfig, getAllCategories } from './api/home'
import baseUrl from './../helpers/baseUrl'
import fetch from 'isomorphic-unfetch'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion';
import {RouterTracking} from './../components/router/ngprogress'
import { ToastContainer } from 'react-toastify';

export async function getServerSideProps() {
  try {
      let promiseCats, promiseConfigs;
      // const allCategory = await getCategoryList.json()
      await Promise.all([getPostConfig(), getAllCategories()])
      .then((values) => {
      promiseConfigs = values[0]
      promiseCats = values[1]
    
      console.log("promise all_apps ",promiseCats )
    })
  console.log("get site info", promiseConfigs, promiseCats)
  console.log("state config ====================>", promiseConfigs);

    return {
      props: {
        config: JSON.parse(JSON.stringify(promiseConfigs[0])),
        allCats: JSON.parse(JSON.stringify(promiseCats))
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

  const getCats = useCallback(async () => {
    let allCategories;

    try{
      allCategories = await fetch(`${baseUrl}/api/categories`, { method: "GET"})
      const allCategoriesRes = await allCategories.json()
      setAllCatsGetting(getAllCategory(allCategoriesRes, id))
    }
    catch(err){
      console.log(err)
    }
  }, [id])

  useEffect(() => {
    Promise.resolve(localStorage.getItem("info"))
  //  RouterTracking(routering.route)
  // console.log(allCats)
  getCats()
  console.log("all Getting", config, allCats, id)
  }, [id])


  console.log("all Getting", configData(localStorageData), config, allCats, id)
    return (
        <themeContextUser.Provider value={{
            getToken: tokenStorage,
            userIsConnected: userIsConnected,
            userConnected: connected,
            postsCategory: allCatsGetting,
            dataConfig: configData(localStorageData)
        }}>
            <themeContextUser.Consumer>
                {({userConnected, postsCategory, dataConfig}) => (
                    <AnimatePresence>
                      <ToastContainer />
                      <Component key={router.route} allCats={postsCategory} config={localStorageData} connect={userConnected()} {...pageProps} />
                    </AnimatePresence>
                )}
            </themeContextUser.Consumer>
        </themeContextUser.Provider>)
}