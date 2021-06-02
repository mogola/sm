import { useState, useEffect} from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import baseUrl from '../helpers/baseUrl'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import Menu from './../components/home/Menu'
import Footer from './../components/home/Footer'
import Prestation from './../components/home/Prestation'
import {RouterTracking} from './../components/router/ngprogress'
import {getPostConfig, getAllPosts } from './api/home'
import {useRouter} from 'next/router'
import Masonry from './../components/Masonry'
import {motion} from 'framer-motion'

import { Button, Container, Content, Image, Media, Card, Heading, Box, Loader, Tag, Form, Columns } from 'react-bulma-components';
const {Field, Control, Label} = Form;

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

export async function getServerSideProps() {
const getData = await fetch(`${baseUrl}/api/about`, {method:"GET"})
const data = await getData.json()
const config = await getPostConfig()
const getPostData = await getAllPosts(6)

return {
    props: {
      data: JSON.parse(JSON.stringify(data.data)),
      allPost:JSON.parse(JSON.stringify(getPostData)),
      config: JSON.parse(JSON.stringify(config[0])),
    }
  }
}


const variants = {
  enter: {
      opacity: 1,
      x:0,
      transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
        x: { stiffness: 1000, velocity: -100 },
        opacity: { stiffness: 1000, velocity: -100 }
      }
  },
  exit: {
      opacity: 0,
      x:-1000,
      transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
      x: { stiffness: 1000 },
      }
  }
}

export default function About({post, data, config, allPost, connect}) {
const [configs, setConfigs] = useState(config)
const router = useRouter()

    useEffect(()=> {
    }, [data])

  return (<motion.div
    variants={variants}
    className="motionWrapper loginWrapper"
    initial="exit"
    animate="enter"
    exit="exit">
    <Layout post>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <ToastContainer />
      <Menu
            state={config}
            connect={connect}
            classMenu="fixedMenu"
        />
      <Field className="noMarginContent">
          <Columns className="aboutMainProfil">
            <Columns.Column className="txtContentProfil">
                <Content className="textProfil"
                    dangerouslySetInnerHTML={{__html:data.description}}>
                </Content>
            </Columns.Column>
            <Columns.Column className="mainProfilImage">
                <Image src={data.urlProfilImage} />
            </Columns.Column>
          </Columns>
          <Container className="profilSubContent">
            <Columns>
                <Columns.Column className="mainListImageProfil">
                    <Content className="listImageProfil">
                          {data.getImagesPost.map((items, i) => (
                              <Image key={i} src={items} />
                          ))}
                    </Content>
                </Columns.Column>
                <Columns.Column className="profilSubText">
                    <Content>
                        <Heading className="titleAboutName" size={4}>
                            {data.titleProfilAbout}
                        </Heading>
                        <Content className="contentText"
                            dangerouslySetInnerHTML={{__html:data.descriptionProfil}}>
                        </Content>
                    </Content>
                </Columns.Column>
            </Columns>
          </Container>
          <Container className="profilSubContent">
            <Heading className="titleAboutName" size={4}>
                {data.titleLogiciel}
            </Heading>
            <Content className="listTools">
                {data.listLogiciel.map((item, i) => (
                    <span key={i}>{item}</span>
                ))}
            </Content>
          </Container>
        </Field>
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
    </motion.div>
  )
}