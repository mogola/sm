import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { themeContextUser } from 'context/contextUser'
import baseUrl from '../helpers/baseUrl'
import fetch from 'node-fetch'

const name = 'Your Name'
export const siteTitle = 'Next.js Sample Website'

export default function Layout({ children, home, portfolio}) {
  const [dataConfigs, setDataConfig] = useState()
  const [naming, setNaming] = useState()
  const getData = async () => {
    const getData =await fetch(`${baseUrl}/api/homeconfig`)
    const data = await getData.json()

    new Promise((resolve) => {
      resolve(data)
    }).then(result => {
      console.log(result, result.nameSite)
      setNaming(result.nameSite)
      setDataConfig(data)
    })
  }

  useEffect(() => {
    getData()
    console.log("get data", dataConfigs)
  }, [])

  return (
    <themeContextUser.Consumer>
    {({dataConfig}) => (
    <div data={naming} className={portfolio ? "config.nameSite" : styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={`header-portfolio ${styles.header}`}>
        {home ? (
          <>
            <img
              src="/images/profile.png"
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : portfolio ? (
          <>
          <div className="mainHeader">
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <a className={`txtLogo ${utilStyles.colorInherit}`}>{naming}</a>
              </Link>
            </h2>
          </div>
          </>
        ) : (
          <>
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
    )}
    </themeContextUser.Consumer>
  )
}