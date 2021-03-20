import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import { getAllCategories, getPostConfig } from '../api/home'
import {useRef,useEffect,useState} from 'react'
import Layout, { siteTitle } from '../../components/layout'
import Menu from './../../components/home/Menu'
import Footer from './../../components/home/Footer'
import Masonry from './../../components/Masonry'
import moment from 'moment'
import {motion, useViewportScroll } from 'framer-motion'
import { NextSeo } from 'next-seo';
import SectionsRecent from './../../components/home/SectionRecent'
import { themeContextUser } from './../../context/contextUser'
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
const Category = ({post, config, filter = false, isadmin= false, connect, categories, allPost, allCats})=>{
    const router = useRouter()
    const {id} = router.query
    const [configs, setConfigs] = useState(config)
    const [isAdmin, setIsAdmin] = useState(connect)
    const [isAnim, setIsAnim] = useState(false)
    const [getPost, setGetPost] = useState([])
    const [allPosts, getAllPosts] = useState({})
 console.log("allCats id cat", allCats, allCats.length)

    const ComponentCategory = ({animboolean}) => {

      const filterPosts = (paramsId) => {
        
        const getIdCat = allPosts.find(post => {
          console.log(post._id, paramsId);
          return post._id === paramsId 
        })

        console.log(allPost);
        setGetPost(getIdCat.posts)
      }
      
      return (
        <Container breakpoint="fullhd" className="breadCategory">
          <Heading className="titleBreadCategory" size={3}> Autres categories : </Heading>
          <ul className="listBreadCategory">
          {categories.map((cat, i) => (
              <li key={i}>
                  <Link key={i} href={`/category/${cat.nameCategory}`} as={`/category/${cat._id}`}>
                      <a onClick={() => {
                          animatePage()
                          console.log('refresh page');
                          console.log("click on category");
                          console.log(allPost);
                          const filterPost = allPost.find(post => post._id === cat._id)
                          console.log(filterPost.posts)
                          setGetPost(filterPost.posts)
                      }}
                      className="linkToCategories">{cat.nameCategory}</a>
                  </Link>
              </li>
          ))}
          </ul>
      </Container>
      )
    }


    if(router.isFallback){
        return(
            <h3>loading...</h3>
        )
    }
    useEffect(() => {
      console.log("isAnim", isAnim, id)
      console.log(allPost, post.posts.length)
      // let postId  = allCats.find(post => post._id === id)
      //     let postsId = postId["posts"]
      //     console.log("======posts======", postsId);
      // setGetPost(getPost)
      //setGetPost(postId)
    }, [])

  

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
      <Section className="section-category">
      <Container fluid className="containerTitleSection">
        </Container>
            <Columns className="homeCategory">
      <themeContextUser.Consumer>
                {({userConnected, postsCategory}) => (
                  <>
                  <div>{postsCategory.map((item, i) => (
                   <div key={i}>
                     {item.posts.map((post, h) => (
                         <React.Fragment key={h}>
                             {h === 0 &&
                                 <Container fluid className="mainProject onTopView" key={`${h}${post._id}`}>
                                 <Columns.Column className="columnProject" size={12}>
                                     <motion.div variants={backVariants} className="categoryMainFilter">
                                     <Link
                                         href={'/projet/[slug]'}
                                         as={`/projet/${encodeURIComponent(post.title)}`}
                                     >
                                         <a>
                                             <Image className="mainImageCategory" loading="lazy" rounded={false} src={post.imageMainPrincipal} />
                                         </a>
                                     </Link>
                                     {item.nameCategory &&
                                         <Heading className={`${!filter ? "singleTitleCategory" : ''} titleMainCategory filterCategory`} size={1}>
                                         {item.nameCategory}
                                         {filter === true && <motion.div
                                             className={`${filterToggle ? "filterVisible" : "filterHidden"} filterCategoryStatic homesFilter`}
                                             initial="enter"
                                             animate="enter"
                                             exit="exit"
                                             variants={backVariants}
                                             data-id={filterToggle}
                                             >
                                             <motion.ul variants={variantsUl}>
                                                 {getcategories.map((item, i) => (
                                                 <motion.li
                                                 variants={variantsItem}
                                                 key={h}>
                                                     <Tag
                                                         data-id={item._id}
                                                         className={`tagCatAdmin ${selectedCategories(item._id) ? "active" : "inactive" }`}
                                                         name={item.nameCategory}
                                                         style={{opacity:`${selectedCategories(item._id) ? 1 : 0.5 }`}}
                                                         onClick={(e) => {
                                                         e.preventDefault()
                                                         filterData(item._id, item.nameCategory, h)
                                                         }}>
                                                         {item.nameCategory}
                                                     </Tag>
                                                 </motion.li>
                                                 ))}
                                                 </motion.ul>
                                             </motion.div>
                                         }
                                         </Heading>
                                     }
                                     </motion.div>
                                     <Content className="info">
                                         <Tag.Group className="tagGroupPost">
                                             <Tag className="recentDate">
                                                 {moment(post.date).locale('fr').format('MMMM YYYY', 'fr')}
                                                 <span className="nbItem">{`0${h+1}`}</span>
                                             </Tag>
                                             {post.listCategory.map((tag, j) => (
                                                 <Tag  key={`${j}${post._id}`}>{tag}</Tag>
                                             ))}
                                         </Tag.Group>
                                     <motion.div  variants={backVariants} className="center-category">
                                         <Heading className="subTitleMainProject" size={1}>
                                         {post.title}
                                         </Heading>
                                         <Content className="contentText">
                                             <p>
                                             {post.subTextDescription.substring(1, 200)}
                                             </p>
                                         </Content>
                                         </motion.div>
                                         <div className="indexZone">
                                             <div className="contentZone">
                                             <span className="nbItem">{`0${h+1}`}</span>
                                             <Link
                                                     href={{
                                                         pathname:'/projet/[slug]',
                                                         query:{id: post._id},
                                                     }}
                                                     as={`/projet/${encodeURIComponent(post.title)}`}
                                                 >
                                                     <a className="linkSee">Voir le projet <span className="icoRight" width={26}></span></a>
                                                 </Link>
                                                 <>
                                                 {
                                                     isadmin &&
                                                     <Link href={'/admin/manageproject/[id]'} as={`/admin/manageproject/${post._id}`}>
                                                         <a className="updatePost">View Post</a>
                                                     </Link>
         
                                                 }
                                                 </>
                                             </div>
                                         </div>
                                         </Content>
                                     </Columns.Column>
                                     <ComponentCategory animaboolean={isAnim} />
                                     </Container>
                             }
                             {h !== 0 &&
                                 <Container breakpoint="fullhd" fluid className="mainProject subMainProject" key={`${i}${post._id}`}>
                                     <Columns.Column className="columnProject" size={12}>
                                         <Content className="info secondary-pr">
                                         <Tag.Group className="tagGroupPost">
                                             <Tag className="recentDate">
                                                 {moment(post.date).locale('fr').format('MMMM YYYY', 'fr')}
                                                 <span className="nbItem">{h+1 > 9 ? `${i+1}` : `0${h+1}`}</span>
                                             </Tag>
                                             {post.listCategory.map((tag, j) => (
                                                 <Tag key={`${j}${post._id}`}>{tag}</Tag>
                                             ))}
                                         </Tag.Group>
                                             <motion.div className="center-category">
                                             <Link
                                                 href={'/projet/[slug]'}
                                                 as={`/projet/${encodeURIComponent(post.title)}`}
                                             >
                                             <a>
                                                 <Image loading="lazy" className="mainImageCategory" rounded={false} src={post.imageMainPrincipal} />
                                                 </a>
                                             </Link>
                                             </motion.div>
                                             <div className="indexZone">
                                                 <div className="contentZone">
                                                 <span className="nbItem">{h+1 > 9 ? `${h+1}` : `0${h+1}`}</span>
                                                 </div>
                                             </div>
                                             </Content>
                                             <Content className="wrapperPostProject">
                                                 <div className="infoPostCategory">
                                                     <Heading className="subTitleMainProject" size={1}>
                                                     {post.title}
                                                     </Heading>
                                                     <Content className="contentText">
                                                         <p>
                                                         {post.subTextDescription.substring(1, 200)}
                                                         </p>
                                                     </Content>
                                                 </div>
                                                 <Link
                                                     href={'/projet/[slug]'}
                                                     as={`/projet/${encodeURIComponent(post.title)}`}
                                                 >
                                                     <a className="linkSee">Voir le projet <span className="icoRight" width={26}></span></a>
                                                 </Link>
                                                 {
                                                     isadmin &&
                                                     <Link href={'/admin/manageproject/[id]'} as={`/admin/manageproject/${post._id}`}>
                                                         <a className="updatePost" href={`/admin/manageproject/${post._id}`}>View Post</a>
                                                     </Link>
                                                 }
                                             </Content>
                                         </Columns.Column>
                                     </Container>
                                 }
                             </React.Fragment>
                         ))}
                   </div>
                  ))}</div>
                    </>
                  )}
            </themeContextUser.Consumer>
            </Columns>
            </Section>
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
  // try {
      const config = await getPostConfig()
     // const allConfig = await config.json()

      const getCategory = await getAllCategories()
      // const categoriesPost = await getCategory.json()
      const posts = JSON.parse(JSON.stringify(getCategory))

      const getPostData = await posts.find(post => post._id === id)
      const getCategoryList = await getAllCategories()

       // const allCategory = await getCategoryList.json()

        return {
          props: {
              allPost: posts,
              post:JSON.parse(JSON.stringify(getPostData)),
              config: JSON.parse(JSON.stringify(config[0])),
              categories: JSON.parse(JSON.stringify(getCategoryList))
          }
      }
    // }
    // catch(err){
    //   console.log("error lors de la dynamisation", err)
    // }

   
}

// This function gets called at build time
export async function getStaticPaths() {
    // Call an external API endpoint to get posts
 //   try{
       const getCategory = await getAllCategories()
        const posts = JSON.parse(JSON.stringify(getCategory))
      // Get the paths we want to pre-render based on posts
      const paths = posts.map((category) => ({
        params: { id: category._id },
      }))

      // We'll pre-render only these paths at build time.
      // { fallback: false } means other routes should 404.
      return { paths, fallback: false }
   // }
    // catch(err){
    //   console.log("err", err)
    // }
  }

export default Category