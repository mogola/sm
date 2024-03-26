import React, {useState, useEffect, useCallback} from 'react'
import '../styles/global.scss'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css'
import { themeContextUser, tokenStorage, userIsConnected, connected, configData, getAllCategory, getDataFromLocalStorage} from './../context/contextUser'
import baseUrl from './../helpers/baseUrl'
import fetch from 'isomorphic-unfetch'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion';
import {RouterTracking} from './../components/router/ngprogress'
import { ToastContainer } from 'react-toastify';

export async function getStaticProps() {
  try {
      let promiseCats, promiseConfigs;
      const getnewcat = await fetch(`${baseUrl}/api/categories`, {method: "GET"})
      const getData = await fetch(`${baseUrl}/api/data`, {method: "GET"})
      await Promise.all([getData.json(), getnewcat.json()])
      .then((values) => {
      promiseConfigs = values[0]
      promiseCats = values[1]
    
      console.log("promise all_apps ",promiseCats )
    })
  console.log("get site info", promiseConfigs, promiseCats)
  console.log("state config ====================>", promiseConfigs);

    return {
      props: {
        config: promiseConfigs[0],
        allCats: promiseCats,
        error: [],
      },
      revalidate: 1
    } 
  }
  catch(err){
    console.log("err", err)
    return { notFound: true };
  }
}

export default function App({ Component, pageProps, config, router, allCats }) {
  const {id} = router.query
  const [localStorageData , setLocalStorageData] = useState(config)
  const [allCatsGetting, setAllCatsGetting] = useState([]);

  const getCats = async () => {
    try {
      let getDataCategories;
      const cachedCategories = localStorage.getItem('categories');
  
      if (cachedCategories === null || cachedCategories === 'undefined' || cachedCategories.length === 0) {
        const response = await fetch(`${baseUrl}/api/categories`, { method: "GET" });
        const allCategoriesRes = await response.json();
        localStorage.setItem("categories", JSON.stringify(allCategoriesRes)); // Corrected storage
        getDataCategories = allCategoriesRes;
      } else {
        getDataCategories = JSON.parse(cachedCategories); // Corrected retrieval and parsing
      }
  
      console.log('Categories:', getDataCategories, typeof getDataCategories);
      setAllCatsGetting(getAllCategory(getDataCategories, id));
    } catch (err) {
      console.error(err);
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