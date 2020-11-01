import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { getSortedPostsData, getPostFromDataBase} from '../lib/posts'
import baseUrl from '../helpers/baseUrl'
import fetch from 'node-fetch'

import { getPostConfig } from './api/home'

export async function getStaticProps() {
  const config = await getPostConfig()

  return {
    props: {
      config: JSON.parse(JSON.stringify(config[0]))
    },
    revalidate: 1, // In secondes
  }
}

export default function Home({config}) {
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


    // const res = await fetch('api/addpost',
    // {
    //   method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //   mode: 'cors', // no-cors, *cors, same-origin
    //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //   credentials: 'same-origin', // include, *same-origin, omit
    //   headers: {
    //     'Content-Type': 'application/json'
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   redirect: 'follow', // manual, *follow, error
    //   referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //   body: JSON.stringify({
    //     "title" : title,
    //     "urlImage" : urlImage
    //   }) // body data type must match "Content-Type" header
    // })

    // return res.json()

    //addingPost.then((data) => console.log(data))
  }

  return (
    <Layout portfolio>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width:"100%",
        zIndex: -1
      }} className="homeImage">
        <img src={configs['logoSiteUrl']} width="100%" height="auto"/>
      </div>
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