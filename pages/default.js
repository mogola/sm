import { useState } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Masonry from './../components/Masonry'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

import { getPostConfig, getAllPosts, getAllCategories} from './api/home'

export async function getServerSideProps() {
  // const config = await getPostConfig()
  // const posts = await getAllPosts(4)
  // const getCategoryList = []
  try {
    let promiseCat, promiseConfig, promisePosts;
    // const allCategory = await getCategoryList.json()
    await Promise.all([getPostConfig(), getAllCategories(), getAllPosts()])
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

const Imagelist = ({children}) => {
  return (
    <>
      {children.map((item, i) => (
        <img loading="lazy" rel="preload" key={i} src={item.imageMainPrincipal} />
      ))}
    </>
  )
}
export default function Default({posts}) {
  return (
    <Layout post>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Masonry children={posts} booleanlist={true} content={<Imagelist children={posts}/>} classnameplus="containerfullWidth"/>
    </Layout>
  )
}