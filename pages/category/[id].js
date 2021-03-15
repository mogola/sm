import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import baseUrl from '../../helpers/baseUrl'
// import { getAllPosts, getPostConfig } from '../api/home'
import {useRef,useEffect,useState} from 'react'
import Layout, { siteTitle } from '../../components/layout'
import Menu from './../../components/home/Menu'
import Footer from './../../components/home/Footer'
import Masonry from './../../components/Masonry'
import moment from 'moment'
import {motion, useViewportScroll } from 'framer-motion'
import { NextSeo } from 'next-seo';
import SectionsRecent from './../../components/home/SectionRecent'

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
import { postcssVersion } from 'autoprefixer'

let easing = [0.175, 0.85, 0.42, 0.96];

const backVariants = {
    exit: {
      x: 100,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: easing,
        staggerChildren: 0.05
      }
    },
    enter: {
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.5,
        ease: easing,
        staggerChildren: 0.05
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
const Category = ({post, config, connect, categories, allPost})=>{
    const [configs, setConfigs] = useState(config)
    const [isAdmin, setIsAdmin] = useState(connect)
    const [isAnim, setIsAnim] = useState(false)
    const [getPost, setGetPost] = useState(post.posts)
    const [allPosts, getAllPosts] = useState(allPost)
    const router = useRouter()
    const {id} = router.query

    const ComponentCategory = ({animboolean}) => {

      const filterPosts = (paramsId) => {
        
        const getIdCat = allPosts.find(post => {
          console.log(post._id, paramsId);
          return post._id === paramsId 
        })

        console.log(getIdCat);
        setGetPost(getIdCat.posts)
      }

      return (
        <motion.div variants={backVariants} className="motionWrapper" initial="exit" animate={animboolean ? "exit": "enter"} exit="exit">
        <Container breakpoint="fullhd" className="breadCategory">
          <Heading className="titleBreadCategory" size={3}> Autres categories : </Heading>
          <ul className="listBreadCategory">
          {categories.map((cat, i) => (
              <li key={i}>
                  <Link key={i} href={`/category/${cat.nameCategory}`} as={`/category/${cat._id}`}>
                      <a onClick={(e) => {
                        e.preventDefault();
                          animatePage()
                          console.log('refresh page');
                          filterPosts(cat._id)
                          router.push({
                            pathname: `/category/${cat._id}`, 
                            query: cat.nameCategory
                          });

                          router.reload()
                      }}
                      className="linkToCategories">{cat.nameCategory}</a>
                  </Link>
              </li>
          ))}
          </ul>
      </Container>
      </motion.div>
      )
    }


    if(router.isFallback){
        return(
            <h3>loading...</h3>
        )
    }

    useEffect(() => {
      console.log("isAnim", isAnim)
      console.log(getPost, post.posts.length)
    }, [getPost])

    const animatePage = () => {
        setIsAnim(false)
    }
    return(<>
      <Menu
      state={config}
      connect={connect}
      classMenu="singleMenuNoHome"
  /><motion.div variants={backVariants} className="motionWrapper" initial="exit" animate={isAnim ? "exit": "enter"} exit="exit">
        <Layout
            none
        >
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {getPost.length &&
      <motion.div variants={variantsUl} className="motionWrapper" initial="exit" animate={isAnim ? "exit": "enter"} exit="exit">
        <SectionsRecent
            title={post.nameCategory}
            data={getPost}
            className="section-category"
            isadmin={isAdmin === true ? true : false}
            getcategories={categories}
            filter={false}
            component={<ComponentCategory animaboolean={isAnim} />}
            />
            </motion.div>
        }
        {post.posts.length === 0 &&
        <> no posts</>
        }

        <Footer
          menu={configs.menuCategoryLink}
          data={configs}
          className="section-footer"
        />
        </Layout>
        </motion.div>
        </>
    )
}

export async function getStaticProps({params:{id}}) {
  let config, allConfig, getCategory, categoriesPost, posts, getPostData, getCategoryList, allCategory;

    try{
     config = await fetch(`${baseUrl}/api/info`, {method: 'GET'})
     allConfig = await config.json()

     getCategory = await fetch(`${baseUrl}/api/categories`, {method: 'GET'})
     categoriesPost = await getCategory.json()
     posts = JSON.parse(JSON.stringify(categoriesPost))

     getPostData = await posts.find(post => post._id === id)
     getCategoryList = await fetch(`${baseUrl}/api/categories`, {
        method: "GET",
      })

       allCategory = await getCategoryList.json()
    }
    catch(err){
        console.log(err)
    }

    return {
        props: {
            allPost: posts,
            post:JSON.parse(JSON.stringify(getPostData)),
            config: JSON.parse(JSON.stringify(allConfig)),
            categories: allCategory
        }
    }
}

// This function gets called at build time
export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    let getCategory, categoriesPost, posts, paths;

    try{
        getCategory = await fetch(`${baseUrl}/api/categories`, {method: 'GET'})
        categoriesPost = await getCategory.json()
        posts = JSON.parse(JSON.stringify(categoriesPost))
      // Get the paths we want to pre-render based on posts
      paths = posts.map((category) => ({
        params: { id: category._id },
      }))

      // We'll pre-render only these paths at build time.
      // { fallback: false } means other routes should 404.
      return { paths, fallback: false }
    }
    catch(err){
      console.log(err)
    }
  }

export default Category