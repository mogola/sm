import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import {useRouter, Router} from 'next/router'
import { getSortedPostsData, getPostFromDataBase} from '../lib/posts'
import Sections from './../components/home/Section'
import About from './../components/home/About'
import Prestation from './../components/home/Prestation'
import Hometop from './../components/home/Hometop'
import Footer from './../components/home/Footer'
import baseUrl from '../helpers/baseUrl'
import fetch from 'node-fetch'
import { motion } from 'framer-motion';
import {RouterTracking} from './../components/router/ngprogress'

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

let easing = [0.175, 0.85, 0.42, 0.96];

const imageVariants = {
  exit: { x: 150, opacity: 0.6, transition: { duration: 0.5, ease: easing } },
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing
    }
  }
};

const textVariants = {
  exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.1, duration: 0.5, ease: easing }
  }
};

const backVariants = {
  exit: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: easing,
      staggerChildren: 0.05
    }
  },
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: easing,
      staggerChildren: 0.05
    }
  }
};
export default function Home({config, posts, connect}) {
  const [title, setTitle] = useState();
  const [urlImage, setUrlImage] = useState();
  const [configs, setConfigs] = useState(config)
  const [onLoadingPage, setOnLoadingPage] = useState(false)
  const router = useRouter()

  const submitForm = async () => {
    event.preventDefault();

    console.log('title :', title, '', 'url Image', urlImage);

    const addingPost = await getPostFromDataBase({
      "title" : title,
      "urlImage" : urlImage});
     return addingPost
  }

  useEffect(() => {

  //  RouterTracking(router)

  }, [])

  return (<motion.div variants={imageVariants} className="motionWrapper" initial="exit" animate="enter" exit="exit">
    <Layout none>
      <Head>
        <title>{siteTitle}</title>
      </Head>
        <Hometop
          state={config}
          connect={connect}
      />
      <motion.div variants={backVariants}>
          <Sections
            data={posts}
            title={configs.titleCategoryRecent}
            className="section-home"
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
        />
        </motion.div>
      {/* <Link href="/admin/dashboard">
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
      {/* <section className={utilStyles.headingMd}>
        <p>Captain Tsubasa</p>
        <p><Link href="/posts/first-post"><a>Go to post</a></Link></p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>  */}
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
    </motion.div>
  )
}