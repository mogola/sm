import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { getSortedPostsData, getPostFromDataBase} from '../lib/posts'
import Sections from './../components/home/Section'
import Hometop from './../components/home/Hometop'
import baseUrl from '../helpers/baseUrl'
import fetch from 'node-fetch'

import { getPostConfig, getAllPosts} from './api/home'

export async function getStaticProps() {
  const config = await getPostConfig()
  const posts = await getAllPosts(4)
  return {
    props: {
      config: JSON.parse(JSON.stringify(config[0])),
      posts: JSON.parse(JSON.stringify(posts))
    }
  }
}

export default function Home({config, posts, connect}) {
  const [title, setTitle] = useState();
  const [urlImage, setUrlImage] = useState();
  const [configs, setConfigs] = useState(config)
  const submitForm = async () => {
    event.preventDefault();

    console.log('title :', title, '', 'url Image', urlImage);

    const addingPost = await getPostFromDataBase({
      "title" : title,
      "urlImage" : urlImage});

     return addingPost
  }

  return (
    <Layout none>
      <Head>
        <title>{siteTitle}</title>
      </Head>
        <Hometop state={config} connect={connect}/>
        <Sections data={posts} title={configs.titleCategoryRecent}/>
      <Link href="/admin/dashboard">
        <a>Go to Dashboard</a></Link>
      <form onSubmit={submitForm}>
        <div className="title_p">
          <label htmlFor="title">title</label>
          <input
            name="title"
            defaultValue=""
            onChange={(e) => {
              console.log("value title", e.target.value)
              setTitle(e.target.value)
            }}
          />
        </div>
        <div className="url_p">
          <label htmlFor="url">Url Image</label>
          <input
            name="url"
            defaultValue=""
            onChange={(e) => {
              console.log("value url image", e.target.value)
              setUrlImage(e.target.value)
            }}
          />
        </div>
      <button>Ajouter du contenu</button>
      </form>
      {/* <ul>
        {homes.map((post, i) => (
          <li key={i}>
            <h2>{post.title}</h2>
            <h3>{post.urlImage}</h3>
          </li>
        ))}
      </ul> */}
      <section className={utilStyles.headingMd}>
        <p>Captain Tsubasa</p>
        <p><Link href="/posts/first-post"><a>Go to post</a></Link></p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      {/* <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section> */}
    </Layout>
  )
}