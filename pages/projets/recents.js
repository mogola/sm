import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from './../../components/layout'
import utilStyles from './../../styles/utils.module.css'
import Link from 'next/link'
import { getSortedPostsData, getPostFromDataBase} from './../../lib/posts'
import SectionsRecent from './../../components/home/SectionRecent'
import About from './../../components/home/About'
import Prestation from './../../components/home/Prestation'
import Menu from './../../components/home/Menu'
import Footer from './../../components/home/Footer'
import baseUrl from './../../helpers/baseUrl'
import fetch from 'node-fetch'
import PropTypes from 'prop-types';
import {RouterTracking}from './../../components/router/ngprogress'
import {useRouter} from 'next/router'
import {motion} from 'framer-motion'

import { getPostConfig, getAllPosts} from './../api/home'

export async function getStaticProps() {
  const config = await getPostConfig()
  const posts = await getAllPosts()
  return {
    props: {
      config: JSON.parse(JSON.stringify(config[0])),
      posts: JSON.parse(JSON.stringify(posts))
    }
  }
}

const imageVariants = {
  exit: { x: -150, opacity: 0.6,
    transition: {
      duration: 0.5,
      type:"spring",
      when: "afterChildren" } },
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      type:"spring",
    }
  }
};

export default function Home({config, posts, connect}) {
  const [configs, setConfigs] = useState(config)
  const [isAdmin, setIsAdmin] = useState(connect)
  const [onLoadingPage, setOnLoadingPage] = useState(false)
  const router = useRouter()
  useEffect(() => {
   // RouterTracking(router)
  //  setOnLoadingPage(true)
  }, [])


  // if(!onLoadingPage){
  //   return <div className="loaderPage">
  //     <motion.div
  //       animate={{ y: -25, opacity: 0.4 }}
  //       transition={{
  //         repeat: Infinity,
  //         repeatType: "reverse",
  //         duration: 1
  //       }}
  //       className="visualLoader">
  //         S
  //       </motion.div>
  //       <motion.div
  //       animate={{ y: 25, opacity: 0.3 }}
  //       transition={{
  //         repeat: Infinity,
  //         repeatType: "reverse",
  //         duration: 1
  //       }}
  //       className="visualLoader">
  //         M
  //       </motion.div>
  //   </div>
  // }

  return (<motion.div variants={imageVariants} className="motionWrapper" initial="enter" animate="enter" exit="exit">
      <Layout none>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <Menu
          state={config}
          connect={connect}
      />
          <SectionsRecent
            data={posts}
            className="section-category"
            isadmin={isAdmin === true ? true : false}
          />
          <Footer
            menu={configs.menuCategoryLink}
            data={configs}
            className="section-footer"
          />
      </Layout>
    </motion.div>
  )
}

Home.propTypes = {
  isadmin: PropTypes.bool
}