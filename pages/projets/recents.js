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

import { getPostConfig, getAllPosts, getAllCategories} from './../api/home'
import {
  Container,
  Columns,
  Section,
  Heading,
  Image,
  Box,
  Loader,
  Tag,
  Content
} from 'react-bulma-components';
export async function getStaticProps() {
  try {
    const config = await getPostConfig()
    const posts = await getAllPosts()
    const getCategoryList = await getAllCategories()

    return {
      props: {
        config: JSON.parse(JSON.stringify(config[0])),
        posts: JSON.parse(JSON.stringify(posts)),
        categories: JSON.parse(JSON.stringify(getCategoryList))
      }
    }
  }
  catch(err){
    console.log("recent fetch", err)
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

export default function Home({config, posts, connect, categories}) {
  const [configs, setConfigs] = useState(config)
  const [isAdmin, setIsAdmin] = useState(connect)
  const [onLoadingPage, setOnLoadingPage] = useState(false)
  const [isAnim, setIsAnim] = useState(false)
  const [getPost, setGetPost] = useState(posts)
  const animatePage = () => {
    setIsAnim(!isAnim)
}

console.log("posts", posts)

const Filtercomponent = () => {
  return(
  <Container className="breadCategory">
      <Heading className="titleBreadCategory" size={3}>Filtrer par : </Heading>
      <ul className="listBreadCategory">
      {categories.map((cat, i) => (
          <li key={i}>
              <Link key={i} href={`/category/${cat.nameCategory}`} as={`/category/${cat._id}`}>
                  <a onClick={() => {
                      animatePage()
                  }}
                  className="linkToCategories">{cat.nameCategory}</a>
              </Link>
          </li>
      ))}
      </ul>
  </Container>)
}
  return (<>
    <Menu
      state={config}
      connect={connect}
      classMenu="singleMenuNoHome"
  />
<motion.div variants={imageVariants} className="motionWrapper" initial={isAnim === true ? "exit": "enter"} animate="enter" exit="exit">
      <Layout none>
        <Head>
          <title>{siteTitle}</title>
        </Head>
          <SectionsRecent
            title="Mes Projets"
            data={getPost}
            className="section-category"
            isadmin={isAdmin === true ? true : false}
            getcategories={categories}
            component={<Filtercomponent />}
          />
          <Footer
            menu={configs.menuCategoryLink}
            data={configs}
            className="section-footer"
          />
      </Layout>
    </motion.div>
    </>
  )
}

Home.propTypes = {
  isadmin: PropTypes.bool
}