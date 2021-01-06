import {useState} from 'react'
import Link from 'next/link'
import moment from 'moment'
import arrowRight from './../../public/images/right-arrow.svg'
import { motion } from 'framer-motion';
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

const backVariants = {
  exit: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: easing
    }
  },
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: easing
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


const Sections = ({title = "", data = [], getcategories = [], ...rest}) => {
  const [animBool, setAnimBool] = useState(true)
  const [categoriesDefault, setCategoriesDefault] = useState(getcategories)
  const [postsFilter, setPostsFilter] = useState(data)
  const [catSelected, setCatSelected] = useState([])

  const selectedCategories = (itemid) => {
    console.log(catSelected)
    if(catSelected.some(value => value === itemid)){
        return true
    }else{
        return false
    }
}

const notifySuccess = () => {
  toast.success("aucun post", {
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

const filterData = (itemid, i) => {
    console.log(itemid)
    const findCategoryPost = getcategories.filter(value => value._id === itemid)

    console.log(findCategoryPost.length, findCategoryPost[0].posts.length)

    console.log("itemid Category", [...catSelected, itemid])
    let lengthCat = [...catSelected, itemid]

    if(findCategoryPost[0].posts.length === 0){
        notifySuccess()
        return ''
    }else {
        console.log(findCategoryPost[0].posts)
        if(catSelected.some(value => value === itemid)){
            let cloneCatSelected =[...catSelected]
            cloneCatSelected.splice(itemid, 1)
            console.log("cloneSelected", cloneCatSelected)
            if(cloneCatSelected.length === 0) {
                setPostsFilter(data)
            }else {
                console.log("rest", cloneCatSelected)
                let multipleCatSelected = [...cloneCatSelected]
                let concatPosts = []

                for(let i = 0; i < multipleCatSelected.length; i++){
                    let filterCats = getcategories.filter(value => value._id === multipleCatSelected[i])
                    console.log("get post array", filterCats[0].posts)
                     concatPosts.push(filterCats[0].posts)
                    console.log("concatpost", concatPosts)
                }

                setPostsFilter(concatPosts[0])
            }

            setCatSelected(cloneCatSelected)

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

                console.log('coooliei', concatPostsMultiple)

                setPostsFilter(concatPostsMultiple)
                setCatSelected([...catSelected, itemid])
            } else {
                setPostsFilter(findCategoryPost[0].posts)
                setCatSelected([...catSelected, itemid])
                console.log(selectedCategories(itemid))
            }
        }

    }
  }
    return(<motion.div variant={variants} className="motionWrapper" initial="exit" animate={animBool ? "enter" : "exit"} exit="exit">
      <ToastContainer />
    <Section {...rest}>
        <Container className="containerTitleSection">
        <Heading className="titleMainCategory" size={1}>
          {title}
        </Heading>
        <div className="filterCategory">
        {getcategories.map((item, i) => (
              <Tag key={i}
              data-id={item._id}
              className={`tagCatAdmin ${selectedCategories(item._id) ? "active" : "inactive" }`}
              name={item.nameCategory}
              style={{opacity:`${selectedCategories(item._id) ? 1 : 0.7 }`}}
              onClick={(e) => {
              e.preventDefault()
              filterData(item._id, i)
              }}>
              {item.nameCategory}
              </Tag>
          ))}
          </div>
        </Container>
        <Container>
        <motion.div variants={variantsUl}>
            <Columns className="homeCategory">
            {postsFilter.map((post, i) => (
                <Columns.Column key={i} size="half">
                    <motion.div variants={variantsItem}>
                    <Link
                        href={'/projet/[slug]'}
                        as={`/projet/${encodeURIComponent(post.title)}`}
                      >
                      <a>
                        <Image rounded={false} src={post.imageMainPrincipal} />
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
    </motion.div>)
}

export default Sections;