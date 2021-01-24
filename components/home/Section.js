import {useState, useEffect} from 'react'
import Link from 'next/link'
import moment from 'moment'
import arrowRight from './../../public/images/right-arrow.svg'
import { motion } from 'framer-motion';
import Image from 'next/image'
import {
    Container,
    Columns,
    Section,
    Heading,
    Box,
    Loader,
    Tag,
    Content
} from 'react-bulma-components';
import { ToastContainer, toast } from 'react-toastify';


import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars} from '@fortawesome/free-solid-svg-icons'

library.add(faBars)

let easing = [0.175, 0.85, 0.42, 0.96];

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

const bgrMenu = {
  exit: {
    x: [-100 , -50, 0],
    rotate: [0, 270, 0],
    opacity : [0.5, 0, 1],
    transition: {
      duration: 2,
      ease: easing
    }
  },
  enter: {
    x: [-100, -50, 0],
    rotate: [0, 270, 0],
    opacity : [0, 0, 1],
    transition: {
      duration: 2,
      ease: easing
    }
  }
};

const imageVariants = {
  exit: { y: 150, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing
    }
  }
};

const textVariants = {
  exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.1, duration: 0.5, ease: easing }
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


const Sections = ({title = "", data = [], getcategories = [], device, ...rest}) => {
  const [animBool, setAnimBool] = useState(true)
  const [categoriesDefault, setCategoriesDefault] = useState(getcategories)
  const [postsFilter, setPostsFilter] = useState(data)
  const [catSelected, setCatSelected] = useState([])
  const [filterToggle, setFilterToggle] = useState(false)
  const selectedCategories = (itemid) => {
    console.log(catSelected)
    if(catSelected.some(value => value === itemid)){
        return true
    }else{
        return false
    }
}

const notifySuccess = (category) => {
  toast.warning(`aucun(s) post(s) pour ${category}`, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    onOpen: () => {
      console.log("aucun post")
    }
  })
}

const toggleFilter = () => {
  setFilterToggle(!filterToggle)
}

const backVariants = {
  enter: {
    x: [device, 0],
    opacity: [0, 1],
    transition: {
      duration: 0.8,
      ease: easing
    }
  },
  exit: {
    x: [0, 0, 0, device],
    opacity: [1, 0.6, 0.3, 0],
    transition: {
      duration: 0.8,
      ease: easing
    }
  }
}

useEffect(() => {
 console.log('filterToggle', filterToggle, device)
}, [])
const filterData = (itemid, nameCat, i) => {
    console.log(itemid)
    const findCategoryPost = getcategories.filter(value => value._id === itemid)

    console.log(findCategoryPost.length, findCategoryPost[0].posts.length)

    console.log("itemid Category", [...catSelected, itemid])
    let lengthCat = [...catSelected, itemid]

    if(findCategoryPost[0].posts.length === 0){
        notifySuccess(nameCat)
        return ''
    }else {
        console.log(findCategoryPost[0].posts)
        if(catSelected.some(value => value === itemid)){
          console.log("before cloneSelected array", [...catSelected])
            let cloneCatSelected = [...catSelected]
            let itemidcat = cloneCatSelected.filter(value => value !== itemid)
            console.log("cloneSelected", itemidcat)
            if(cloneCatSelected.length === 0) {
                setPostsFilter(data)
            }else {
                console.log("rest", itemidcat)
                let multipleCatSelected = [...itemidcat]
                let concatPosts = []

                for(let i = 0; i < multipleCatSelected.length; i++){
                    let filterCats = getcategories.filter(value => value._id === multipleCatSelected[i])
                    console.log("get post array", filterCats[0].posts)
                     concatPosts.push(filterCats[0].posts)
                    console.log("concatpost", concatPosts)
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
                console.log("rest", lengthCat)
                let concatPostsMultiple = []



                for(let i = 0; i < lengthCat.length; i++){
                    let filterCats = getcategories.filter(value => value._id === lengthCat[i])
                    console.log("get post array multiple", filterCats[0].posts)
                    concatPostsMultiple.push(filterCats[0].posts)
                    console.log("concatpost multiple", concatPostsMultiple.flat())
                    concatPostsMultiple = concatPostsMultiple.flat()
                }

                let filterValueDuplicate = []
                for (let i = 0; i < concatPostsMultiple.length; i++){
                  console.log('value filter', filterValueDuplicate.some(value => value !== concatPostsMultiple[i]._id))
                  filterValueDuplicate.push(concatPostsMultiple[i]._id)
                }


                let arrayCloneNotDuplicate = filterValueDuplicate.filter((v, i, a) => a.indexOf(v) === i)

                const fPosts = (arr, element) => {
                  for (let i = 0; i < arr.length; i++){
                    console.log(element._id, arr[i])
                    return element._id === arr[i]
                  }
                }

                const includesPost = data.filter(value => arrayCloneNotDuplicate.includes(value._id))

                let arrayPostNotDuplicate = data.find(element => fPosts(arrayCloneNotDuplicate, element))

                console.log('coooliei', concatPostsMultiple, arrayCloneNotDuplicate, "new posts", includesPost)

                setPostsFilter(includesPost)
                setCatSelected([...catSelected, itemid])
            } else {
                setPostsFilter(findCategoryPost[0].posts)
                setCatSelected([...catSelected, itemid])
                console.log(selectedCategories(itemid))
            }
        }

    }
  }
    return(<>
    <motion.div
      className={`${filterToggle ? "filterVisible" : "filterHidden"} filterCategory homesFilter`}
      initial="enter"
      animate={filterToggle ? "enter" : "exit"}
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
                style={{opacity:`${selectedCategories(item._id) ? 1 : 0.7 }`}}
                onClick={(e) => {
                e.preventDefault()
                filterData(item._id, item.nameCategory, i)
                toggleFilter()
                }}>
                {item.nameCategory}
              </Tag>
          </motion.li>
          ))}
          <motion.li
          variants={variantsItem} key="rzerez" className="returnLink">
          <a
            className="returnLinkDefault"
            onClick={() => {
              toggleFilter()
            }}
          >
            Retour
            <span className="icoRight" width={26}></span>
          </a>
        </motion.li>
        </motion.ul>
      </motion.div>
    <motion.div variant={variants} className="motionWrapper" initial="exit" animate={animBool ? "enter" : "exit"} exit="exit">
      <ToastContainer />
    <Section {...rest}>
        <Container className="containerTitleSection">
        <Heading className="titleMainCategory" size={1}>
          {title}
        </Heading>
        <a
          onClick={(e) => {
            e.preventDefault()
            toggleFilter()
          }}
          className="filterMobileIcon">
        <span>Filtrer par :</span> <FontAwesomeIcon icon="bars" size="xs" />
        </a>
        <motion.div
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
                style={{opacity:`${selectedCategories(item._id) ? 1 : 0.3 }`}}
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
        </Container>
        <Container>
        <motion.div variants={variantsUl} animate={!filterToggle ? "enter" : "exit" }>
            <Columns className="homeCategory">
            {postsFilter.map((post, i) => (
                <Columns.Column key={i} size="half">
                    <motion.div variants={variantsItem} animate={!filterToggle ? "enter" : "exit"}>
                    <Link
                        href={'/projet/[slug]'}
                        as={`/projet/${encodeURIComponent(post.title)}`}
                      >
                      <a>
                        <Image className="postHomeSectionImg" layout="responsive" width={500} height={350} src={post.imageMainPrincipal} />
                      </a>
                      </Link>
                    <Tag.Group className="tagGroupPost">
                        <Tag className="recentDate">
                            {moment(post.date).locale('fr').format('LL', 'fr')}
                        </Tag>
                        {post.listCategory.map((tag, i) => (
                            <Tag key={i}>{tag}</Tag>
                        ))}
                    </Tag.Group>
                    <Heading subtitle className="subTitleProjects">
                       {post.title}
                    </Heading>
                    <Content className="contentText" dangerouslySetInnerHTML={{__html:post.subTextDescription.substring(1, 60)}}>
                    </Content>
                        {/* <Link
                            href={'/project/[id]'}
                            as={`/project/${post._id}`}>
                            <a className="linkSee">Voir le projet <span className="icoRight" width={26}></span></a>
                        </Link> */}
                        <Link
                            href={'/projet/[slug]'}
                            as={`/projet/${encodeURIComponent(post.title)}`}
                        >
                            <a className="linkSee" onClick={() => {
                                setAnimBool(false)
                            }}>Voir le projet <span className="icoRight" width={26}></span></a>
                        </Link>
                        </motion.div>
                </Columns.Column>
                ))}
            </Columns>
            </motion.div>
            <Container className="containLink">
                <Link
                    href={'/projets/[slug]'}
                    as={`/projets/recents`}>
                    <a className="linkSee getOrange">Voir tous les projets <span className="icoRight orangeSvg" width={26}></span></a>
                </Link>
            </Container>
        </Container>
    </Section>
    </motion.div></>)
}

export default Sections;