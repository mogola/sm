import { useState, useEffect, useRef, useLayoutEffect  } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import Menu from './../components/home/Menu'
import Footer from './../components/home/Footer'
import Prestation from './../components/home/Prestation'
import {getPostConfig } from './api/home'
import {useRouter} from 'next/router'
import { motion } from 'framer-motion';

import { Button, Container, Content, Image, Media, Card, Heading, Box, Loader, Tag, Form, Columns } from 'react-bulma-components';
const {Field, Control, Label} = Form;

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

export async function getStaticProps() {
const config = await getPostConfig()
return {
    props: {
      config: JSON.parse(JSON.stringify(config[0]))
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

const imageVariants = {
    exit: { x: -90, opacity: 0.9,
        transition: {
        duration: 0.5,
        type: "tween",
        stiffness:100,
        bounce: 0.5,
        when: "afterChildren"
        } },
    enter: {
        x: 0,
        opacity: 1,
        transition: {
        duration: 0.5,
        type: "tween",
        stiffness: 100,
        bounce: 0.5
        }
    }
};

const variantsUl = {
    enter: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    },
    exit: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
}

const variantsItem = {
    enter: {
      x: 0,
      opacity: 1,
      transition: {
        x: { stiffness: 1000, velocity: -100 }
      }
    },
    exit: {
      x: 100,
      opacity: 0,
      transition: {
        x: { stiffness: 1000 }
      }
    }
  };

export default function Prestations({config, connect}) {
const [configs, setConfigs] = useState(config)
const router = useRouter()

    useEffect(()=> {
     //   RouterTracking(router)
    }, [])

  return (<motion.div
            variants={variants}
            style={{backgroundImage: `url(${config.logoSiteUrl})`}}
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
            classMenu="singleMenuNoHome contactMenu"
        />
            <Container className="prestationWrapper">
            <motion.div variants={variantsUl}>
            <Columns className="homeCategory">

                <Columns.Column size="half">
                <motion.div variants={variantsItem}>
                    <Card className="post">
                    <Card.Image rel="preload" src="/illustration_presta.png" />
                        <Card.Content>
                            <Heading>
                                Illustration
                            </Heading>
                            <Content>
                                Vous êtes à la recherche d'un illustrateur pour vos projets ?
                                Storyboard, création de personnages, concept visuel, illustration pour vos besoins personnelles ou professionelles.
                                J'y répondrais avec plaisir n'hésitez à prendre contact avec moi.
                            </Content>
                            <Content>
                                <Button className="is-orange" size={"medium"}>
                                    <Link href="/contact">
                                        <a className="button is-orange">Contact</a>
                                    </Link>
                                </Button>
                            </Content>
                        </Card.Content>
                        </Card>
                        </motion.div>
                    </Columns.Column>


                    <Columns.Column size="half">
                    <motion.div variants={variantsItem}>
                            <Card className="post">
                            <Card.Image rel="preload" src="/textile_presta.png" />
                            <Card.Content>
                                <Heading>
                                    Design textile
                                </Heading>
                                <Content>
                                    Vous êtes à la recherche d'un illustrateur pour vos projets ?
                                    Storyboard, création de personnages, concept visuel, illustration pour vos besoins personnelles ou professionelles.
                                    J'y répondrais avec plaisir n'hésitez à prendre contact avec moi.
                                </Content>
                                <Content>
                                <Button className="is-orange" size={"medium"}>
                                    <Link href="/contact">
                                        <a className="button is-orange">Contact</a>
                                    </Link>
                                </Button>
                            </Content>
                            </Card.Content>
                            </Card>
                            </motion.div>
                    </Columns.Column>
                </Columns>
                </motion.div>
                <motion.div variants={variantsItem}>
                <Field className="otherTxtBlock">
                    <Heading>
                        Vous avez d'autres idées ?
                    </Heading>
                    <Content>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. consectetur adipiscing elit. Fusce ac nulla consequat, euismod ipsum dictum, condimentum lectus. Sed rutrum lacinia lacus vestibulum maximus. Suspendisse porta
                    </Content>
                    <Button className="is-orange" size={"large"}>
                        <Link href="/contact">
                            <a>Contact</a>
                        </Link>
                    </Button>
                </Field>
                </motion.div>
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
    </motion.div>
  )
}