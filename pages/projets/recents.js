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
        />
    </Layout>
  )
}