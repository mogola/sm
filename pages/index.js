import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import {FacebookScript} from './../components/scripting'
import Link from 'next/link'
import Sections from './../components/home/Section'

import About from './../components/home/About'
import Prestation from './../components/home/Prestation'
import Hometop from './../components/home/Hometop'
import Footer from './../components/home/Footer'
import baseUrl from '../helpers/baseUrl'
import fetch from 'node-fetch'
import { motion } from 'framer-motion';

import { getPostConfig, getAllPosts, getAllCategories} from './api/home'

export async function getServerSideProps() {
  // const config = await getPostConfig()
  // const posts = await getAllPosts(4)
  // const getCategoryList = []
try {
  let promiseCat, promiseConfig, promisePosts;
  // const allCategory = await getCategoryList.json()
  await Promise.all([getPostConfig(), getAllCategories(), getAllPosts(4)])
  .then((values) => {
   promiseConfig = values[0]
   promiseCat = values[1]
   promisePosts = values[2]
 
   console.log("promise all Index",promisePosts)
 })
 
   return {
     props: {
       config: JSON.parse(JSON.stringify(promiseConfig[0])),
       posts: JSON.parse(JSON.stringify(promisePosts)),
       categories: JSON.parse(JSON.stringify(promiseCat))
     }
   }
}
catch(err){
  console.log("err", err)
}

}

// export async function getStaticProps() {
//   try {
//     const [configRes, categoryRes, postRes] = await Promise.all([
//       getPostConfig(),
//       getAllCategories(),
//       getAllPosts(4)
//     ])

//     const [configs, categories, posts] = await Promise.all([
//       configRes.json(),
//       categoryRes.json(),
//       postRes.json()
//     ])


//     Promise.all([getPostConfig(), getAllCategories(),getAllPosts(4)]).then(value => {console.log(values)})

//     console.log("get site info", configs, categories)
//       return {
//         props: {
//           config: JSON.parse(JSON.stringify(configs[0])),
//           posts: JSON.parse(JSON.stringify(posts)),
//           allCats: JSON.parse(JSON.stringify(categories))
//         }
//       }
//   }
//   catch(err){
//     console.log(err)
//   }
// }

const imageVariants = {
  exit: { x: -90, opacity: 0.9,
    transition: {
      duration: 0.5,
      type: "tween",
      stiffness:100,
      bounce: 0.5,
      when: "afterChildren"
    } },
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "tween",
      stiffness: 100,
      bounce: 0.5
    }
  }
};

const backVariants = {
  exit: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      staggerChildren: 0.05
    }
  },
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.5,
      type: "spring",
      staggerChildren: 0.05
    }
  }
};

export default function Home({config, posts, connect, categories}) {
  const [configs, setConfigs] = useState(config)
  const [valueScreen, setValueScreen] = useState()
  const [isAnim, setIsAnim] = useState(false)

  let compareStorage = (initialStorage, newStorage) => {
    initialStorage = JSON.parse(initialStorage)
    if(initialStorage !== null && initialStorage.__v === newStorage.__v)
    return true
    else
    return false
  }

  const onClick= () =>{
    setIsAnim(true)
  }

  useEffect(() => {
    if(window){
      setValueScreen(window.innerWidth)
    }

    if(compareStorage(localStorage.getItem("info"), config)) {
      setConfigs(JSON.parse(localStorage.getItem('info')))
    }else {
      return ''
    }

    console.log("config index", config)
  }, [])

  return (<motion.div variants={imageVariants} className="motionWrapper" initial="exit" animate={isAnim === true ? "exit": "enter"} exit="exit">
    <Layout none homepage>
      <Head>
        <title>{siteTitle}</title>
        <FacebookScript />
      </Head>
        <Hometop
          state={config}
          connect={connect}
          onClick={onClick}
      />
      <motion.div variants={backVariants}>
          <Sections
            data={posts}
            title={config.titleCategoryRecent}
            className="section-home"
            getcategories={categories}
            device={valueScreen && valueScreen }
          />
        </motion.div>
        <motion.div variants={backVariants}>
        <About
          data={config.textContentAbout}
          title={config.titleCategoryAbout}
          className="section-about"
        />
        </motion.div>
        <motion.div variants={backVariants}>
        <Prestation
          data={config.textContentServices}
          title={config.textCategoryServices}
          className="section-prestation"
        />
        </motion.div>
        <motion.div variants={backVariants}>
        <Footer
          menu={config.menuCategoryLink}
          data={config}
          className="section-footer"
          onClick={onClick}
        />
        </motion.div>
    </Layout>
    </motion.div>
  )
}