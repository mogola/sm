import React, {useState, useEffect, useCallback} from 'react'
import '../styles/global.scss'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css'
import { themeContextUser, tokenStorage, userIsConnected, connected, configData, getAllCategory, getDataFromLocalStorage} from './../context/contextUser'
import { getPostConfig, getAllCategories } from './api/home'
import baseUrl from './../helpers/baseUrl'
import fetch from 'isomorphic-unfetch'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion';
import {RouterTracking} from './../components/router/ngprogress'
import { ToastContainer } from 'react-toastify';

export async function getStaticProps() {
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
        allCats: JSON.parse(JSON.stringify(promiseCats)),
        error: [],
      },
      revalidate: 1
    } 
  }
  catch(err){
    console.log(err)
  }
}

export default function App({ Component, pageProps, config, router, allCats }) {
  const {id} = router.query
  const [localStorageData , setLocalStorageData] = useState(config)
  const [allCatsGetting, setAllCatsGetting] = useState([]);

  const getCats = async () => {
    let getDataCategories; 
    try{
      if(localStorage.getItem('categories') === null || localStorage.getItem('categories') === undefined || localStorage.getItem('categories').length === 0 ) {
        let allCategories = await fetch(`${baseUrl}/api/categories`, { method: "GET"})
        const allCategoriesRes = await allCategories.json()
        localStorage.setItem("categories", allCategoriesRes)
        getDataCategories = allCategoriesRes
        console.log('get categories server', getDataCategories, typeof getDataCategories)
        setAllCatsGetting(getAllCategory(getDataCategories, id))
        console.log('getDataCategories', getDataCategories)
      }else {
        // getDataCategories =localStorage.getItem('categories')
        let allCategories = await fetch(`${baseUrl}/api/categories`, { method: "GET"})
        const getDataCategories = await allCategories.json()
        console.log('get categories localstorage',getDataCategories, typeof getDataCategories)
        setAllCatsGetting(getAllCategory(getDataCategories, id))
        console.log('getDataCategories', getDataCategories)
      }

      
    }
    catch(err){
      console.log(err)
    }
  }

  React.useEffect(() => {
    (async () => {
      Promise.resolve(localStorage.getItem("info"))
      getCats()
      console.log("all Getting", config, allCats, id)
    })();
  }, [id])

return (
    <themeContextUser.Provider value={{
        getToken: tokenStorage,
        userIsConnected: userIsConnected,
        userConnected: connected,
        postsCategory: allCatsGetting,
        dataConfig: configData(localStorageData),
        getDataFromLocal: getDataFromLocalStorage
    }}>
        <themeContextUser.Consumer>
            {({userConnected, postsCategory, getDataFromLocal , dataConfig}) => (
              <AnimatePresence exitBeforeEnter>
                <div>
                  <ToastContainer />
                  <Component 
                    key={router.route} 
                    allCats={postsCategory} 
                    datafromlocalstorage={getDataFromLocal()} 
                    config={getDataFromLocal() !== false ? getDataFromLocal() : config} 
                    connect={userConnected()} 
                    {...pageProps} />
                </div>
              </AnimatePresence>
            )}
        </themeContextUser.Consumer>
    </themeContextUser.Provider>)
}