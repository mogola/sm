import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { themeContextUser } from 'context/contextUser'
import baseUrl from '../helpers/baseUrl'
import fetch from 'node-fetch'

const name = 'Your Name'
export const siteTitle = 'Next.js Sample Website'

export default function Layout({ children, home, portfolio }) {
  const [dataConfigs, setDataConfig] = useState()
  const [naming, setNaming] = useState()
  const [menu, setMenu] = useState()
  const [imageHomeMain, setImageHomeMain] = useState()
  const [titleMain, setTitleMain] = useState()
  const [subTitleImage, setSubTitleImage] = useState()

  let compareStorage = (initialStorage, newStorage) => {
    if(initialStorage === JSON.stringify(newStorage))
    return true
    else
    return false
  }

  let dataStorage = (callback) => {
    console.log("compare object",callback)
    return localStorage.getItem("info") !== null && compareStorage(localStorage.getItem("info"),callback) === true
    ? JSON.parse(localStorage.getItem("info"))
    : callback
  }

  const getData = async () => {
    const getData = await fetch(`${baseUrl}/api/info`)
    const data = await getData.json()

    await new Promise((resolve) => {
        resolve(dataStorage(data))
    }).then(result => {
      console.log(result)
      setNaming(result.nameSite, result.menuCategoryLink)
      setMenu(result.menuCategoryLink)
      setImageHomeMain(result.logoSiteUrl)
      setTitleMain(result.titleMain)
      setSubTitleImage(result.subTitleImage)
      console.log(compareStorage(localStorage.getItem("info"),result))
      if(compareStorage(localStorage.getItem("info"),result)){
        console.log(true)
        setDataConfig(localStorage.getItem("info"))
      }else{
        console.log(false)
        localStorage.setItem("info", JSON.stringify(result))
        setDataConfig(JSON.stringify(result))
      }
    })
  }

  useEffect(() => {
      getData()
  }, [])

  return (
    <themeContextUser.Consumer>
      {({ dataConfig }) => (
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
              <div class="homeWrapper">
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: "100%"
                }}>
                <div className="mainHeader">
                    <div className="divHeader">
                      <h2 className={utilStyles.headingLg}>
                        <Link href="/">
                          <a className={`txtLogo ${utilStyles.colorInherit}`}>{naming}</a>
                        </Link>
                      </h2>
                    </div>
                    {menu &&
                      <div className="mainMenu">
                        <ul>
                          {menu.map((item, i) => (
                            <li key={i}>
                              <Link href={item.url}>
                                <a className="menuLink">{item.name}</a>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    }
                  </div>
                  <div className="titleBlockHome">
                    <h3>
                      {titleMain}
                    </h3>
                    <h3>
                      {subTitleImage}
                    </h3>
                  </div>
                  </div>
                <div style={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  width:"100%",
                  zIndex: -1
                }} className="homeImage">
                  <img src={imageHomeMain} width="100%" height="auto"/>
                </div>
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