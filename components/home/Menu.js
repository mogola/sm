import { themeContextUser } from './../../context/contextUser';
import Link from 'next/link'
import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
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
import utilStyles from '../../styles/utils.module.css'
import { motion, useCycle } from 'framer-motion';
import baseUrl from '../../helpers/baseUrl';
import {notify} from '../notify'
let easing = [0.175, 0.85, 0.42, 0.96];

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
    x: [0, 0, 0, 400, 400, 0, 0, 0],
    opacity: [1, 0.6, 0.3, 0, 0, 0.3, 0.6, 1],
    transition: {
      duration: 2,
      ease: easing
    }
  },
  enter: {
    x: [400, 0],
    opacity: [0, 1],
    transition: {
      duration: 2,
      ease: easing
    }
  }
};

const backVariantsDesktop = {
  exit: {
    x: [-400, 0, 0, 0],
    opacity: [0, 0.3, 0.6, 1],
    transition: {
      duration: 2,
      ease: easing
    }
  },
  enter: {
    x: [400, 0],
    opacity: [0, 1],
    transition: {
      duration: 2,
      ease: easing
    }
  }
};

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

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 100
};

// const variants = {
//   open: { opacity: 1, x: 0 },
//   closed: { opacity: 0, x: "-100%" },
// }

const variantsUl = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
}

const variants = {
  open: {
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
  closed: {
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
const variantsItem = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};
const Menu = ({state = '', connect, classMenu = ''}) => {
    const [textAvailable, setTextAvailable] = useState([])
    const [isUserAdmin, setIsUserAdmin] = useState()
    const [isMobile, setIsMobile] = useState(768)
    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const [isToggle, setIsToggle] = useCycle(false, true);
    const [isBackground, setIsBackground] = useState(state.colorBackgroundMenu)
    const [isInnerWidth, setIsInnerWidth] = useState()
    const [isDisconnect, setIsDisconnect] = useState(false)
    const router = useRouter()
    //const [isOpen, toggleOpen] = useCycle(false, true);
    const viewPortDetection = () => {
        console.log(window.innerWidth)
        if(window.innerWidth < isMobile){
          setIsMobileMenu(true)
        console.log(isMobileMenu)
      }else{
        setIsMobileMenu(false)
        console.log(isMobileMenu)
      }
    }

    const toggleMenu = (e) => {
      e.preventDefault()
      setIsToggle()
      console.log("console.log toggle", isToggle)
    }
    const scrollToTheView = () => {
      let wrapper = document.querySelector(".homeWrapper");
      console.log("wrapper", wrapper.offsetHeight)
      let classNameExist = wrapper.getAttribute("class");
      let verifyClassExist = classNameExist.split(" ");
      console.log(verifyClassExist)

      const verify = (val, arr) => {
        return arr.some((value) => value === val)
      }

      if(!verify("scrolling", verifyClassExist)){
        wrapper.setAttribute("class", `${classNameExist} scrolling`)
      }else{
        console.log("class Exist")
      }

      window.scroll({
        top: wrapper.offsetHeight,
        behavior: 'smooth'
      })

    }
    useEffect(() => {
      setIsInnerWidth(window.innerWidth)
        const available = state.textAvailable.split(' ')
        let arrayAvailable = []
        let arrayConcat = [];

        available.forEach(key => {
            let keyLetter = key.split('')
            keyLetter.push(' ')
            arrayAvailable.push(keyLetter)
        })

        arrayAvailable.map((item, i) => {
            let accItem = item
            arrayConcat = [...arrayConcat, ...accItem]
        })

        setTextAvailable(arrayConcat)
        console.log("isConnected", connect)
        setIsUserAdmin(connect)
        window.addEventListener('resize',viewPortDetection)
        viewPortDetection()

        console.log("isBackground", typeof(isBackground))
    }, [isInnerWidth, ])

    const disconnect = async (e, callback) => {
      e.preventDefault()
      setIsDisconnect(true)
      setIsUserAdmin(false)
      notify("error", "vous avez été déconnecté")
      callback()
      localStorage.removeItem('userIsConnected')
      localStorage.removeItem('token')
      await fetch(`${baseUrl}/api/disconnect`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token':''
      },
      }).then( data => {
        console.log("vous êtes désormais déconnecté", data)
        router.push(`/`)
      })
    }

    return (<motion.div className="motionWrapper" initial="exit" animate="enter" exit="exit">
      <themeContextUser.Consumer>
        {({userConnected}) => (
          <div className={`${classMenu} mainMenuNoHome`}>
            <Link href="" >
                <motion.a
                animate={isToggle ? "enter" : "exit"}
                variants={bgrMenu}
                  className={`
                  ${isMobileMenu ? "menuBurgerMobile": "menuBurgerDesktop"} menuB
                  ${isToggle ? "isOpen" : "isClosed"}
                  `}
                  onClick={(e) => {
                    e.preventDefault()
                    setIsToggle()}}
                >
                  <span className="mTop"></span>
                  <span className="mBottom"></span>
                </motion.a>
              </Link>
                  <div className="contentMenu">
                  <div className="mainHeader">
                      <motion.div
                      animate={isToggle ? "enter" : "exit"}
                      variants={isMobileMenu ? backVariants : backVariantsDesktop} className="divHeader">
                        <h2 className={`
                        ${utilStyles.headingLg}
                        ${isMobileMenu ? "activeMobileMenu": "activeDesktopMenu"}
                        ${isToggle ? "isOpen" : "isClosed"}
                        `}>
                          <Link href="/">
                            <a
                              className={`txtLogo ${utilStyles.colorInherit}`}
                            >{state.nameSite}</a>
                          </Link>
                        </h2>
                      </motion.div>
                      {state.menuCategoryLink && isMobileMenu &&
                        <motion.div
                        variants={variants}
                        data-ismobile={isMobileMenu}
                        style={isMobileMenu ? {backgroundColor: isBackground} : {backgroundColor: "transparent"}}
                        className={`mainMenu ${isMobileMenu} ${isMobileMenu ? "activeMobile": "activeDesktop"} ${isToggle ? "isOpen" : "isClosed"}`}
                        animate={isToggle ? "open" : "closed"}
                        initial={false}
                        // transition={{ duration: 1 }}
                        >
                          <motion.ul variants={variantsUl}>
                            {state.menuCategoryLink.map((item, i) => (
                              <motion.li
                              variants={variantsItem} key={i}>
                                <Link href={item.url}>
                                  <a className="menuLink"
                                    onClick={isMobileMenu ? setIsToggle : ''}
                                  >{item.name}</a>
                                </Link>
                              </motion.li>
                            ))}
                            {isUserAdmin &&
                            <React.Fragment>
                            <motion.li
                              variants={variantsItem} key="izeoirere">
                              <Link href="/admin/config">
                                <a
                                  onClick={(e) => {
                                    setIsToggle()}}
                                  className="menuLink">Manage globales</a>
                              </Link>
                              </motion.li>
                            <motion.li
                              variants={variantsItem} key="izeoireze">
                              <Link href="/admin/project">
                                <a
                                  className="menuLink"
                                  onClick={(e) => {
                                    setIsToggle()}}
                                >Create project</a>
                              </Link>
                              </motion.li>
                              <motion.li
                                variants={variantsItem} key="izeoifdrefre">
                                <Link href="/">
                                  <a onClick={(e) => {
                                      disconnect(e, setIsToggle)
                                  }}
                                  className="menuLink"
                                  >logout</a>
                                </Link>
                              </motion.li>
                            </React.Fragment>
                            }
                            {!isUserAdmin &&
                            <React.Fragment>
                            <motion.li
                              variants={variantsItem} key="izeeroire">
                              <Link href="/login">
                                <a
                                onClick={(e) => {
                                    setIsToggle()}}
                                    className="menuLink">Login</a>
                              </Link>
                              </motion.li>
                            <motion.li
                              variants={variantsItem} key="izeoifdfre">
                              <Link href="/Register">
                                <a
                                  className="menuLink"
                                  onClick={(e) => {
                                    setIsToggle()}}
                                >register</a>
                              </Link>
                              </motion.li>
                            </React.Fragment>
                            }
                          </motion.ul>
                        </motion.div>
                      }
                      {state.menuCategoryLink && !isMobileMenu &&
                        <div
                        data-ismobile={isMobileMenu}
                        style={isMobileMenu ? {backgroundColor: isBackground} : {backgroundColor: "transparent"}}
                        className={`mainMenu ${isMobileMenu} ${isMobileMenu ? "": "activeDesktop"} ${isToggle ? "isOpen" : "isClosed"}`}
                        // transition={{ duration: 1 }}
                        >
                          <ul>
                            {state.menuCategoryLink.map((item, i) => (
                              <li
                              key={i}>
                                <Link href={item.url}>
                                  <a className="menuLink"
                                    onClick={isMobileMenu ? setIsToggle : ''}
                                  >{item.name}</a>
                                </Link>
                              </li>
                            ))}
                            {isUserAdmin &&
                            <React.Fragment>
                            <li
                              key="izeoirere">
                              <Link href="/admin/config">
                                <a className="menuLink">Manage globales</a>
                              </Link>
                              </li>
                            <li
                               key="izeoireze">
                              <Link href="/admin/project">
                                <a className="menuLink">Create project</a>
                              </Link>
                              </li>
                              <li key="izeoifdrefre">
                              <Link href="/">
                                <a onClick={(e) => { disconnect(e)}} className="menuLink">logout</a>
                              </Link>
                              </li>
                            </React.Fragment>
                            }
                            {!isUserAdmin &&
                            <React.Fragment>
                            <li
                              key="izeeroire">
                              <Link href="/login">
                                <a className="menuLink">Login</a>
                              </Link>
                              </li>
                            <li
                               key="izeoifdfre">
                              <Link href="/Register">
                                <a className="menuLink">register</a>
                              </Link>
                              </li>
                            </React.Fragment>
                            }
                          </ul>
                        </div>
                      }
                    </div>
                    <div>
                    </div>
                    </div>
                </div>
      )}
      </themeContextUser.Consumer>
      </motion.div>
    )
}

export default Menu;