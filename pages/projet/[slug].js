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
import moment from 'moment'
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

const Post = ({post, config, connect})=>{
    const [configs, setConfigs] = useState(config)
    const router = useRouter()
    console.log(router)
    const {id} = router.query
    console.log("id of post", router.isFallback)

    if(router.isFallback){
        return(
            <h3>loading...</h3>
        )
    }

    useEffect(() => {
        const handleRouteChange = (url) => {
            console.log('App is changing to: ', url)
          }
        router.events.on('beforeHistoryChange', handleRouteChange)
    }, [])

    return(
        <Layout post>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Menu
            state={config}
            connect={connect}
        />
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
        <div className="container center-align">
           <ul>
                {post.linkImage &&
                   <li key="oier">
                       <img src={post.linkImage} width={200} />
                    </li>
                }
                <li key="peiroi">
                    <img src={post.imageMainPrincipal} width="auto" height="auto" />
                </li>
                <li key="eiopzieop">
                    <Container className="descriptionPost">
                        <Content className="contentText" dangerouslySetInnerHTML={{__html:post.subTextDescription}}>
                        </Content>
                    </Container>
                </li>
            </ul>
            <Container className="listImagesPost">
                <Columns>
                    {
                        post.imageArray.map((image, i) => (
                            <Columns.Column key={i} size="half">
                                <Image src={image} height="auto" />
                            </Columns.Column>
                        ))
                    }
                </Columns>
            </Container>
            <Link href="/projets/recents">
            <a className="linkSee nextProjectLink">Voir le prochain projet <span className="icoRight" width={26}></span></a>
            </Link>
        </div>
        <Footer
          menu={configs.menuCategoryLink}
          data={configs}
          className="section-footer"
        />
        </Layout>
    )
}

export async function getStaticProps({params:{slug}}) {
    try{
    const config = await getPostConfig()
    const postData = await getAllPosts()
    const posts = JSON.parse(JSON.stringify(postData))
    const getPostData = posts.find(post => post.title == slug)

    console.log('data', getPostData)

    return {
            props: {
                post:JSON.parse(JSON.stringify(getPostData)),
                config: JSON.parse(JSON.stringify(config[0]))
            }
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