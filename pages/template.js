import { useState, useEffect, useRef, useLayoutEffect  } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import baseUrl from '../helpers/baseUrl'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import Menu from './../components/home/Menu'
import Footer from './../components/home/Footer'
import Prestation from './../components/home/Prestation'
import {getPostConfig, getAllPosts } from './api/home'
import Masonry from './../components/Masonry'
import { Button, Container, Content, Image, Media, Card, Heading, Box, Loader, Tag, Form, Columns } from 'react-bulma-components';
const {Field, Control, Label} = Form;

export async function getServerSideProps() {
    const getData = await fetch(`${baseUrl}/api/about`, {method:"GET"})
    const data = await getData.json()
    const config = await getPostConfig()
    const getPostData = await getAllPosts(6)

    console.log("data about", JSON.parse(JSON.stringify(data)))
    console.log("post", getPostData)
    return {
        props: {
          data: JSON.parse(JSON.stringify(data.data)),
          allPost:JSON.parse(JSON.stringify(getPostData)),
          config: JSON.parse(JSON.stringify(config[0])),
        }
      }
    }

export default function Template({}) {

  const submitForm = async () => {
  }

  return (
    <Layout none>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <ToastContainer />
      <Menu
            state={config}
            connect={connect}
            classMenu="fixedMenu"
        />
      <form onSubmit={submitForm}>
      </form>
      <Prestation
          data={configs.textContentServices}
          title={configs.textCategoryServices}
          className="section-prestation"
        />
        <Footer
          menu={configs.menuCategoryLink}
          data={configs}
          className="section-footer"
        />
    </Layout>
  )
}