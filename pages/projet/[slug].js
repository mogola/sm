import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import {useRouter} from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import { getAllPosts, getPostConfig } from '../api/home'
import {useRef,useEffect,useState} from 'react'
import Layout, { siteTitle } from '../../components/layout'
import Menu from './../../components/home/Menu'
import Footer from './../../components/home/Footer'

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
        <Layout none>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Menu
            state={config}
            connect={connect}
        />
        <div className="container center-align">
           <ul>

                   {post.linkImage &&
                   <li>
                       <img src={post.linkImage} width={200} />
                    </li>
                }
                <li>
                    {post._id}
                </li>
                <li>
                    {post.title}
                </li>
                <li>
                    <img src={post.imageMainPrincipal} width="auto" height="auto" />
                </li>
                <li>
                    <>
                        {
                            post.imageArray.map((image, i) => (
                                <img key={i} src={image} width={200} height="auto" />
                            ))
                        }
                    </>
                </li>
                <li>
                   <a onClick={() =>{
                       console.log(router.back('/admin/dashboard'))
                    }}>Return to the list</a>
                </li>
           </ul>
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