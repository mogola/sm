import React, { useState, useEffect } from 'react'
import baseUrl from "./../../helpers/baseUrl"
import Link from 'next/link'
import moment from 'moment'
import arrowRight from './../../public/images/right-arrow.svg'
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
import { ToastContainer, toast } from 'react-toastify';
import { themeContextUser } from './../../context/contextUser'
import { motion } from 'framer-motion';

let easing = [0.175, 0.85, 0.42, 0.96];

const imageVariants = {
  exit: { scale: 1, opacity: 0, transition: { type: "spring", duration: 0.5, staggerChildren: 0.05} },
  enter: {
   scale: 1,
    opacity: 1,
    transition: {
        type: "spring",
      duration: 0.5,
      staggerChildren: 0.05
    }
  }
};

const textVariants = {
  exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.1, duration: 0.5, ease: easing}
  }
};

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

const SectionsRecent = ({title= "", component, data = [], isadmin, getcategories = [], filter = true, ...rest}) => {
    const [postsFilter, setPostsFilter] = useState(data)
    const [catSelected, setCatSelected] = useState([])
    const [filterToggle, setFilterToggle] = useState(false)
    const [categoriesDefault, setCategoriesDefault] = useState([])

    // function for selection id category on array catSelected
    const selectedCategories = (itemid) => {
        if(catSelected.some(value => value === itemid)){
            return true
        }else{
            return false
        }
    }

    const filterData = (itemid, nameCat, i) => {
        console.log(itemid, nameCat, i, categoriesDefault)
        const findCategoryPost = categoriesDefault.filter(value => value._id === itemid)
        console.log(categoriesDefault)
        let lengthCat = [...catSelected, itemid]

        if(findCategoryPost[0].posts.length === 0){
            notifySuccess(nameCat)
            return ''
        }else {
            console.log(findCategoryPost[0].posts)
            if(catSelected.some(value => value === itemid)){
                let cloneCatSelected = [...catSelected]
                let itemidcat = cloneCatSelected.filter(value => value !== itemid)
                if(cloneCatSelected.length === 0) {
                    setPostsFilter(data)
                }else {
                    let multipleCatSelected = [...itemidcat]
                    let concatPosts = []

                    for(let i = 0; i < multipleCatSelected.length; i++){
                        let filterCats = getcategories.filter(value => value._id === multipleCatSelected[i])
                         concatPosts.push(filterCats[0].posts)
                    }

                    if(multipleCatSelected.length === 0){
                      setPostsFilter(data)
                    } else {
                      setPostsFilter(concatPosts[0].flat())
                    }
                }

                setCatSelected(itemidcat)

            }else{

                if(lengthCat.length > 1){
                    let concatPostsMultiple = []
                    for(let i = 0; i < lengthCat.length; i++){
                        let filterCats = getcategories.filter(value => value._id === lengthCat[i])
                        concatPostsMultiple.push(filterCats[0].posts)
                        concatPostsMultiple = concatPostsMultiple.flat()
                    }

                    let filterValueDuplicate = []
                    for (let i = 0; i < concatPostsMultiple.length; i++){
                      filterValueDuplicate.push(concatPostsMultiple[i]._id)
                    }


                    let arrayCloneNotDuplicate = filterValueDuplicate.filter((v, i, a) => a.indexOf(v) === i)

                    const fPosts = (arr, element) => {
                      for (let i = 0; i < arr.length; i++){
                        return element._id === arr[i]
                      }
                    }

                    const includesPost = data.filter(value => arrayCloneNotDuplicate.includes(value._id))

                    setPostsFilter(includesPost)
                    setCatSelected([...catSelected, itemid])
                } else {
                    setPostsFilter(findCategoryPost[0].posts)
                    setCatSelected([...catSelected, itemid])
                }

                console.log("post findcategory", findCategoryPost[0].posts)
            }

        }
      }

    const toggleFilter = () => {
        setFilterToggle(!filterToggle)
      }

      const notifySuccess = (category) => {
        toast.warning(`Aucun(s) post(s) pour ${category}`, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onOpen: () => {
          }
        })
      }

    useEffect(() => {
        console.log('filterToggle', filterToggle)
        
        async function getsCategories() {
            const fetchCat = await fetch(`${baseUrl}/api/categories`, {method: "GET"})
            const getCats = await fetchCat.json()
            
            let getFetch = JSON.parse(JSON.stringify(getCats))
            console.log("getcat", getFetch)
            
            setCategoriesDefault(getFetch)
        }
        
        getsCategories()
        
        }, [])
    
    
    return(<motion.div variants={backVariants} className="motionWrapper" initial="exit" animate="enter" exit="exit">
        <ToastContainer />
    <Section {...rest}>
    {/* <themeContextUser.Consumer>
        {({userConnected, postsCategory}) => (
            <div>
                {postsCategory.length}
                {postsCategory.map((item, i) => (
                    <span key={i}>
                        {item.nameCategory}
                    </span>
                ))}
            </div>
        )}
    </themeContextUser.Consumer> */}
        <Container fluid className="containerTitleSection">
        </Container>
            <Columns className="homeCategory">
            {postsFilter.length && postsFilter.map((post, i) => (
                <React.Fragment key={i}>
                    {i === 0 &&
                        <Container fluid className="mainProject onTopView" key={`${i}${post._id}`}>
                        <Columns.Column className="columnProject" size={12}>
                            <motion.div variants={imageVariants} className="categoryMainFilter">
                            <Link
                                href={'/projet/[slug]'}
                                as={`/projet/${encodeURIComponent(post.title)}`}
                            >
                                <a>
                                    <Image className="mainImageCategory" loading="lazy" rounded={false} src={post.imageMainPrincipal} />
                                </a>
                            </Link>
                            {title &&
                                <Heading className={`${!filter ? "singleTitleCategory" : ''} titleMainCategory filterCategory`} size={1}>
                                {title}
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
                                        key={i}>
                                            <Tag
                                                data-id={item._id}
                                                className={`tagCatAdmin ${selectedCategories(item._id) ? "active" : "inactive" }`}
                                                name={item.nameCategory}
                                                style={{opacity:`${selectedCategories(item._id) ? 1 : 0.5 }`}}
                                                onClick={(e) => {
                                                e.preventDefault()
                                                filterData(item._id, item.nameCategory, i)
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
                                        <span className="nbItem">{`0${i+1}`}</span>
                                    </Tag>
                                    {post.categoryArray && post.categoryArray.map((tag, j) => (
                                        <Tag  key={`${j}${post._id}`}>{tag.nameCategory}</Tag>
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
                                    <span className="nbItem">{`0${i+1}`}</span>
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
                            <>{component}</>
                            </Container>
                    }
                    {i !== 0 &&
                        <Container breakpoint="fullhd" fluid className="mainProject subMainProject" key={`${i}${post._id}`}>
                            <Columns.Column className="columnProject" size={12}>
                                <Content className="info secondary-pr">
                                <Tag.Group className="tagGroupPost">
                                    <Tag className="recentDate">
                                        {moment(post.date).locale('fr').format('MMMM YYYY', 'fr')}
                                        <span className="nbItem">{i+1 > 9 ? `${i+1}` : `0${i+1}`}</span>
                                    </Tag>
                                    {post.categoryArray && post.categoryArray.map((tag, j) => (
                                        <Tag key={`${j}${post._id}`}>{tag.nameCategory}</Tag>
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
                                        <span className="nbItem">{i+1 > 9 ? `${i+1}` : `0${i+1}`}</span>
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
            </Columns>
            <Container className="containLink">
                <Link
                    href={'/projets/[slug]'}
                    as={`/projets/recents`}>
                    <a className="linkSee getOrange">Voir tous les projets <span className="icoRight orangeSvg" width={26}></span></a>
                </Link>
            </Container>
    </Section>
    </motion.div>)
}

export default SectionsRecent;