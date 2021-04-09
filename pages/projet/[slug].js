import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import { getAllPosts, getPostConfig } from '../api/home'
import {useRef,useEffect,useState} from 'react'
import Layout, { siteTitle } from '../../components/layout'
import Menu from './../../components/home/Menu'
import Footer from './../../components/home/Footer'
import Masonry from './../../components/Masonry'
import moment from 'moment'
import {RouterTracking} from './../../components/router/ngprogress'
import {motion, useViewportScroll } from 'framer-motion'
import { NextSeo } from 'next-seo';

import {
    Container,
    Columns,
    Section,
    Heading,
    Image,
    Box,
    Loader,
    Tag,
    Content
} from 'react-bulma-components';

const imageVariants = {
    exit: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            duration: 1,
            staggerChildren: 0.05} 
        },
    enter: {
     scale: 1.5,
      opacity: 0.8,
      transition: {
          type: "spring",
            duration: 1,
            staggerChildren: 0.05
      }
    }
  };

  const imageMainVariants = {
    exit: { scale: 0.6, opacity: 0.8,
        transition: {
            type: "spring",
            duration: 1,
            staggerChildren: 0.05} },
    enter: {
     scale: 1,
      opacity: 1,
      transition: {
          type: "spring",
            duration: 1,
            staggerChildren: 0.05
      }
    }
  };

  const slideVariants = {
    exit: { x: [-90, 0], opacity: [0.9, 1],
      transition: {
        duration: 0.5,
        type: "tween",
        stiffness:100,
        bounce: 0.5,
      } },
    enter: {
      x: [0, 0],
      opacity: [1, 1],
      transition: {
        duration: 0.5,
        type: "tween",
        stiffness: 100,
        bounce: 0.5
      }
    }
  }

const Post = ({post, config, connect, nextPost, prevPost, slug}) =>{
    const [configs, setConfigs] = useState(config)
    const [isAnim, setIsAnim] = useState(false)
    const [fixedMenu, setFixedMenu] = useState(false)
    const router = useRouter()
    const {id } = router.query
    const {prefetch} = router
    if(router.isFallback){
        return(
            <h3>loading...</h3>
        )
    }

    useEffect(() => {
       // RouterTracking(router)
       if (prefetch) router.prefetch(window.location.href)
       setIsAnim(false)
       document.addEventListener('scroll', function(event){
        let headerDoc = document.querySelector('.section-footer')
        //console.log(headerDoc)
        if(headerDoc !== null) {
            if((headerDoc.offsetTop - window.scrollY) > window.innerHeight && (headerDoc.offsetTop - window.scrollY) > 0 && (fixedMenu !== true)) {
            //console.log("scroll")
            setFixedMenu(true)
          }else {
            setFixedMenu(false)
          }
      }
       })
       toggleAnim()
    }, [])

    const toggleAnim = () => {
        //console.log("animPage")
        setIsAnim(true)
    }
    return(
        <>
        <Menu
        state={config}
        connect={connect}
        classMenu="singleMenuNoHome"
    />
    <motion.div className="motionWrapper" initial="exit" animate={isAnim ? "exit" :"enter"} exit="exit">
        <NextSeo
            facebook={{
                appId: `${3587318871321107}`,
            }}
                title={post.title}
                description={`${post.description.replace(/<[^>]+>/g, '')}`}
                canonical={`${baseUrl}/projet/${post.title}`}
                openGraph={{
                url: `${baseUrl}/projet/${post.title}`,
                title: `${post.title}`,
                description: `${post.description.replace(/<[^>]+>/g, '')}`,
                type: "article",
                images: [
                    {
                    url: `${post.imageMainPrincipal}`,
                    width: 800,
                    height: 600,
                    alt: 'Og Image Alt',
                    },
                    {
                    url: `${post.imageMainPrincipal}`,
                    width: 900,
                    height: 800,
                    alt: 'Og Image Alt Second',
                    }
                ],
                site_name: `${config.nameSite}`,
                }}
                twitter={{
                handle: '@handle',
                site: '@site',
                cardType: 'summary_large_image',
                }}
            />
        <Layout
            post
            slug={`${post.title}`}
            metaImage={post.imageMainPrincipal}
            postTitle={`${post.title}`}
            postDescription={`${post.description}`}
        >
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <motion.div variants={imageVariants} animate={isAnim === true ? "exit" : "enter"} className="postBgSingle"
        style={{backgroundImage: `url("${post.imageMainPrincipal}")`, backgroundColor:config.backgroudPost}}>
    </motion.div>
        <Container data-id={post._id} className="mainProject" fluid>
            <Columns.Column className="columnProject" size={12}>
                <Content className="info postProjectDetails">
                    <Tag.Group className="tagGroupPost">
                        <Tag className="recentDate">
                            {moment(post.date).locale('fr').format('MMMM YYYY', 'fr')}
                        </Tag>
                        {post.listCategory.map((tag, i) => (
                            <Tag key={i}>{tag}</Tag>
                        ))}
                    </Tag.Group>
                    <div className="center-category">
                        <Heading className="subTitleMainProject" size={1}>
                        {post.title}
                        </Heading>
                        <Content className="contentText" dangerouslySetInnerHTML={{__html:post.description}}>
                        </Content>
                    </div>
                </Content>
                </Columns.Column>
                </Container>
        <Container className="center-align" fluid>
            <Container>
           <ul>
                {post.linkImage &&
                   <li key="oier">
                       <img loading="lazy" rel="preload" src={post.linkImage} width={200} />
                    </li>
                }
                <li key="peiroi">
                    <motion.img 
                        variants={imageMainVariants} 
                        initial="exit" 
                        animate={isAnim ? "enter" :"exit"} 
                        exit="exit"
                        className="imgMainPost" 
                        src={post.imageMainPrincipal} 
                        width="auto" 
                        height="auto" />
                </li>
                <li key="eiopzieop">
                    <Container className="descriptionPost">
                        <Content className="contentText" dangerouslySetInnerHTML={{__html:post.subTextDescription}}>
                        </Content>
                    </Container>
                </li>
            </ul>
            </Container>
            {post.imageArray.length !== 0 && <Container className="listImagesPost" fluid>
                <Container>
                    <Columns>
                    <Masonry
                    booleanlist="false"
                    children={post.imageArray} />
                        {/* {
                            post.imageArray.map((image, i) => (
                                <Columns.Column key={i} size="half">
                                    <Image src={image} height="auto" />
                                </Columns.Column>
                            ))
                        } */}
                    </Columns>
                </Container>
            </Container>
            }
            <div className={`${fixedMenu ? "navigationPostFixed navigationPost" : "navigationPost" } `}>
                <Link href={'/projet/[slug]'} as={`/projet/${encodeURIComponent(nextPost)}`}>
                    <a onClick={(e) => {
                        e.preventDefault()
                        toggleAnim(true)
                        router.push(`/projet/${encodeURIComponent(nextPost)}`)
                    }}
                    className="linkSee nextProjectLink"><span className="txtLinkNav">Voir le projet suivant</span><span className="icoRight" width={26}></span></a>
                </Link>
                <Link href={'/projet/[slug]'} as={`/projet/${encodeURIComponent(prevPost)}`}>
                    <a
                        onClick={(e) => {
                            e.preventDefault()
                            toggleAnim(true)
                            router.push(`/projet/${encodeURIComponent(prevPost)}`)
                        }}
                        className="linkSee prevProjectLink"><span className="icoRight" width={26}></span> <span className="txtLinkNav">Voir le projet précédent</span></a>
                </Link>
            </div>
        </Container>
        <Footer
          menu={configs.menuCategoryLink}
          data={configs}
          className={`${fixedMenu ? "section-footer-fixed section-footer" : "section-footer"  }`}
        />
        </Layout>
        </motion.div>
        </>
    )
}

export async function getStaticProps({params:{slug}}) {
    try{
    const config = await getPostConfig()
    const postData = await getAllPosts()
    const posts = JSON.parse(JSON.stringify(postData))
    const getPostData = await posts.find(post => post.title == slug)
    const findindex = await posts.findIndex(post => {
        console.log(post.title === slug)
        return post.title === slug
    })

    let getPrev = posts[findindex + 1]
    let getNext = posts[findindex - 1]
    let idprev
    let idnext

    if(getNext === undefined) {
        getNext = posts[findindex]
        idnext = getNext.title
    }else {
        idnext = getNext.title
    }

    if(getPrev === undefined) {
        getPrev = posts[findindex]

        idprev = getPrev.title
    }else {
        idprev = getPrev.title
    }
    return {
            props: {
                post:JSON.parse(JSON.stringify(getPostData)),
                config: JSON.parse(JSON.stringify(config[0])),
                nextPost: idprev,
                prevPost: idnext
            },
            revalidate: 1
        }
    }
    catch(err){
        console.log(err)
    }
}

// This function gets called at build time
export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    try{
      const post = await getAllPosts()
      const posts = JSON.parse(JSON.stringify(post))
      // Get the paths we want to pre-render based on posts
      const paths = posts.map((post) => ({
        params: { slug: post.title },
      }))

      // We'll pre-render only these paths at build time.
      // { fallback: false } means other routes should 404.
      return { paths, fallback: false }
    }
    catch(err){
      console.log(err)
    }
  }

export default Post