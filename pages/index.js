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

import { getPostConfig, getAllPosts, gettingCategories} from './api/home'
import Arrayjs from '../components/array'

export async function getStaticProps() {
  const config = await getPostConfig()
  const posts = await getAllPosts(4)
  const getCategoryList = await gettingCategories()

 // const allCategory = await getCategoryList.json()

  return {
    props: {
      config: JSON.parse(JSON.stringify(config[0])),
      posts: JSON.parse(JSON.stringify(posts)),
      categories: JSON.parse(JSON.stringify(getCategoryList))
    }
  }
}

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

  const fetchCategories = async () => {
    try {
      const cats = await fetch(`${baseUrl}/api/categories`,{method:'GET'})
      const getCats = await cats.json()
      
      return JSON.parse(JSON.stringify(getCats))
    }
    catch(err){
      console.log(err)
    }
  }
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
  }, [])

  return (<motion.div variants={imageVariants} className="motionWrapper" initial="exit" animate={isAnim === true ? "exit": "enter"} exit="exit">
    <Layout none homepage>
      <Head>
        <title>{siteTitle}</title>
        <FacebookScript />
      </Head>
        <Hometop
          state={configs}
          connect={connect}
          onClick={onClick}
      />
      <motion.div variants={backVariants}>
          <Sections
            data={posts}
            title={configs.titleCategoryRecent}
            className="section-home"
            getcategories={categories}
            device={valueScreen && valueScreen }
          />
        </motion.div>
        <motion.div variants={backVariants}>
        <About
          data={configs.textContentAbout}
          title={configs.titleCategoryAbout}
          className="section-about"
        />
        </motion.div>
        <motion.div variants={backVariants}>
        <Prestation
          data={configs.textContentServices}
          title={configs.textCategoryServices}
          className="section-prestation"
        />
        </motion.div>
        <motion.div variants={backVariants}>
        <Footer
          menu={configs.menuCategoryLink}
          data={configs}
          className="section-footer"
          onClick={onClick}
        />
        </motion.div>
    </Layout>
    </motion.div>
  )
}