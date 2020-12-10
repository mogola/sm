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

export default function Home({config, posts, connect}) {
  const [configs, setConfigs] = useState(config)
  const [isAdmin, setIsAdmin] = useState(connect)
  const router = useRouter()
  useEffect(() => {
   // RouterTracking(router)
  }, [])
  return (
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
  )
}

Home.propTypes = {
  isadmin: PropTypes.bool
}