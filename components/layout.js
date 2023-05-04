import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { themeContextUser } from '../context/contextUser'
import baseUrl from '../helpers/baseUrl'
import fetch from 'node-fetch'
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';

const name = 'Mogola Sangaré'
export const siteTitle = "Mogola Sangaré website"

export default function Layout({ children, none, home, portfolio, dashboard, post, homepage}) {
  const [naming, setNaming] = useState()
  const [menu, setMenu] = useState()
  const [state, changeState] = useState({});
  const [textAvailable, setTextAvailable] = useState([])
  const [onLoadingPage, setOnLoadingPage] = useState(false)
  const [seoUrl, setSeoUrl] = useState()
  const [fixedMenu, setFixedMenu] = useState(false)

  useEffect(() => {
    setSeoUrl(window.location.href)

      document.addEventListener('scroll', function(event){
        let headerDoc = document.querySelector('.mainHeader')
        if(headerDoc !== null) {
         if(window.scrollY > (headerDoc.offsetTop + headerDoc.offsetHeight)
            && (fixedMenu !== true)) {
              setFixedMenu(true)
            }else {
              setFixedMenu(false)
            }
        }   
       })

  }, [])
    return (
      <>
      <themeContextUser.Consumer>
        {({ dataConfig }) => (
          <div data={naming} className={portfolio || none || post ? "df-none" : styles.container}>
            {homepage && <NextSeo
          facebook={{
              appId: `${3587318871321107}`,
            }}
              title={siteTitle}
              description={siteTitle}
              canonical={`${baseUrl}`}
              openGraph={{
                url: `${baseUrl}`,
                title: `${siteTitle}`,
                description: `${siteTitle}`,
                images: [
                  {
                    url: "/app_visual_dewalgo.jpg",
                    width: 800,
                    height: 600,
                    alt: 'Og Image Alt',
                  },
                  {
                    url: "/app_visual_dewalgo.jpg",
                    width: 900,
                    height: 800,
                    alt: 'Og Image Alt Second',
                  },
                  { url: "/app_visual_dewalgo.jpg" },
                  { url: "/app_visual_dewalgo.jpg" },
                ],
                site_name: `${name}`,
              }}
              twitter={{
                handle: '@handle',
                site: '@site',
                cardType: 'summary_large_image',
              }}
            />}
            <Head>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className={`${fixedMenu ? "fixedMain" : ""} header-portfolio ${styles.header}`}>
              {home ? (
                <>
                  <img
                    src="/images/profile.png"
                    className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
                    alt={name}
                    rel="preload"
                  />
                  <h1 className={utilStyles.heading2Xl}>{state.nameSite}</h1>
                </>
              ) : dashboard ? (
                <>
                  <h1 className={utilStyles.heading2Xl}>
                    <span className={utilStyles.nameSite}>
                      <Link href="/">
                        <a>{state.nameSite}</a>
                        </Link>
                      </span><span>Créer un projet</span>
                  </h1>
                </>
              )
              : portfolio ? (
                <>
                <a className="menuB">
                  <span className="mTop"></span>
                  <span className="mBottom"></span>
                </a>
                <div  className="homeWrapper">
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
                            <a className={`txtLogo ${utilStyles.colorInherit}`}>{state.nameSite}</a>
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
                        {state.titleMain}
                      </h3>
                      <h3>
                        {state.subTitleImage}
                      </h3>
                      <span className="categoryTextHome">Portfolio</span>
                    </div>
                    <div className="infoContact">
                      <span className="emailUser">{state.email}</span>
                      <span className="contactUser">{state.textLocalisation}</span>
                    </div>
                    <div>
                    <div className="pastilleAvailable">
                      {textAvailable.map((letter, i) => (
                        <span key={i} className={`char${i + 1}`}>
                          {letter}
                        </span>
                      ))}
                    </div>
                    </div>
                    <a className="scrollTopLink">{state.textScrollTop}</a>
                    </div>
                  <div className="homeImage">
                    <img data-img={state.menuCategoryLink} rel="prefetch" src={state.logoSiteUrl} width="100%" height="auto"/>
                  </div>
                </div>
                </>
              ) : !homepage ? (
                    <>
                    </>
                  ) : !none && (
                    <></>
                  )}
            </header>
            <main className={post ? "wrapperPost" : ""}>{children}</main>
          </div>
        )}
      </themeContextUser.Consumer>
      </>
    )
}