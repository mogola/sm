import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import {useRouter} from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import { getAllPosts } from '../api/home'
import {useRef,useEffect,useState} from 'react'
import Layout, { siteTitle } from '../../components/layout'
const Post = ({posts})=>{
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
        <Layout portfolio>
      <Head>
        <title>{siteTitle}</title>
      </Head>
        <div className="container center-align">
           <ul>
            {posts.map((post, i) => (
            <li key={i}>
               {post.linkImage &&
                    <div>
                            <img src={post.linkImage} width={200} />
                        </div>
                    }
                <div>
                    {post._id}
                </div>
                <div>
                    {post.title}
                </div>
                <div>
                    <img src={post.imageMainPrincipal} width="auto" height="auto" />
                </div>
                <div>
                    <>
                        {
                            post.imageArray.map((image, i) => (
                                <img key={i} src={image} width={200} height="auto" />
                            ))
                        }
                    </>
                </div>
                <div>
                    <a onClick={() =>{
                        console.log(router.back('/admin/dashboard'))
                    }}>Return to the list</a>
                </div>
           </li>))}
           </ul>
        </div>
        </Layout>
    )
}

export async function getStaticProps({params:{slug}}) {
    try{
    const postData = await getAllPosts()
    const posts = JSON.parse(JSON.stringify(postData))
    const getPostData = posts
        return {
            props: {
                post:JSON.parse(JSON.stringify(getPostData))
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