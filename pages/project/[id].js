import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import {useRouter} from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import { getAllPosts } from '../api/home'
import {useRef,useEffect,useState} from 'react'
import Layout, { siteTitle } from '../../components/layout'

const Post = ({post})=>{
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
        </Layout>
    )
}

export async function getStaticProps({params:{id}}) {
    try{
    const postData = await getAllPosts()
    const posts = JSON.parse(postData)
    const getPostData = posts.find(post => post._id == id)
console.log('data', getPostData)
        return {
            props: {
                post:JSON.parse(JSON.stringify(getPostData))
            },
            revalidate: 1
        }
    }
    catch(err){
        console.log(err)
        return {notFound : true}
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
        params: { id: post._id },
      }))

      // We'll pre-render only these paths at build time.
      // { fallback: false } means other routes should 404.
      return { paths, fallback: false }
    }
    catch(err) {
        console.error("Error fetching data:", err);
        // Corrected return value for getStaticPaths in case of error
        return {
          paths: [], // An empty paths array
          fallback: false // Or true or 'blocking', depending on your desired behavior
        };
    }    
  }

export default Post