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
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

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

export default function Contact({post, data, config, allPost, connect}) {
    const [getData, setGetData] = useState(data)
    const [configs, setConfigs] = useState(config)
    const [posts, setPosts] = useState(allPost)
  const submitForm = async () => {
  }

  return (
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
        <Container className="wrapperContact" fluid>

        <Columns className="ContactMain">
            <Columns.Column className="contentContact">
                <Heading>
                    Contact
                </Heading>
            <form className="formContactMs" onSubmit={submitForm}>
                <div className="columnField">
                    <Field>
                        <Label>label Example</Label>
                        <input className="input" value="" name="oiez" />
                    </Field>
                    <Field>
                        <Label>label Example</Label>
                        <input className="input" value="" name="oiez" />
                    </Field>
                </div>
                <div className="columnField">
                    <Field>
                        <Label>label Example</Label>
                        <input className="input" value="" name="oiez" />
                    </Field>
                    <Field>
                        <Label>label Example</Label>
                        <textarea className="input" value="" name="oiez" />
                    </Field>
                </div>
                <div className="columnField">
                    <Field>
                        <Label>label Example</Label>
                        <input className="input" value="" name="oiez" />
                    </Field>
                </div>
                <div className="columnField">
                    <Field>
                        <Button>
                            Envoyer le message <span className="icoRight"></span>
                        </Button>
                    </Field>
                </div>
      </form>
            </Columns.Column>
            <Columns.Column className="infoContact">
                <div className="ContainerInfo">

                </div>
            </Columns.Column>
          </Columns>
        </Container>
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