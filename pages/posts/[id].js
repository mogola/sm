import fetch from 'isomorphic-unfetch'
import {useRouter} from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import { getPost } from '../api/home'
import {useRef,useEffect,useState} from 'react'

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
                    {post.urlImage}
                </li>
                <li>
                   <a onClick={() =>{
                       console.log(router.back('/admin/dashboard'))
                    }}>Return to the list</a>
                </li>
           </ul>
        </div>
    )
}

export async function getStaticProps({params:{id}}) {
    try{
        const postData = await getPost()
      const posts = JSON.parse(JSON.stringify(postData))
        const getPostData = posts.find(post => post._id == id)
console.log('data', getPostData)
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
      const post = await getPost()
      const posts = JSON.parse(JSON.stringify(post))
      // Get the paths we want to pre-render based on posts
      const paths = posts.map((post) => ({
        params: { id: post._id },
      }))

      // We'll pre-render only these paths at build time.
      // { fallback: false } means other routes should 404.
      return { paths, fallback: false }
    }
    catch(err){
       return { paths: [], fallback: false }
    }
  }

export default Post