

import { themeContextUser } from './../../context/contextUser';
import Link from 'next/link'
import {useState, useEffect, useRef} from 'react'
import Menu from './Menu'
import {motion, useMotionValue} from 'framer-motion';
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


const Hometop = ({state = '', connect}) => {
    const [textAvailable, setTextAvailable] = useState([])
    const [isUserAdmin, setIsUserAdmin] = useState()
    const [isMobile, setIsMobile] = useState(768)
    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const [isToggle, setIsToggle] = useState(false)
    const [isBackground, setIsBackground] = useState(state.colorBackgroundMenu)
    const [isInnerWidth, setIsInnerWidth] = useState()
    const [isDevice, setIsDevice] = useState()
    const [isHomeImage, setIsHomeImage] = useState()

    const scale = useMotionValue(isHomeImage < isDevice ? 1.4 : 1.2)

    const refImageHome = useRef(null)
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
      setIsToggle(!isToggle)
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

        setIsDevice(window.innerWidth)
        if(refImageHome){
          console.log(refImageHome.current.clientWidth)
          setIsHomeImage(refImageHome.current.clientWidth)
        }

        console.log("scale", scale)

    }, [])


const scaleVariants = {
  exit: {
    scale: 1,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: easing
    }
  },
  enter: {
  scale: isHomeImage < isDevice ? 1.4 : 1.2 ,
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: easing
    }
  }
};

    return (
      <themeContextUser.Consumer>
        {({userConnected}) => (
          <>

                <motion.div variants={backVariants} className="homeWrapper">
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: "100%",
                    zIndex: 20000
                  }}>
                      <Menu
                        state={state}
                        connect={connect}
                        classMenu="mainMenuHomePage"
                    />
                    <motion.div variants={backVariants} className="titleBlockHome">
                      <h3>
                        {state.titleMain}
                      </h3>
                      <h3>
                        {state.subTitleImage}
                      </h3>
                      <span className="categoryTextHome">Portfolio</span>
                    </motion.div>
                    <motion.div variants={backVariants} className="infoContact">
                      <span className="emailUser">{state.email}</span>
                      <span className="contactUser">{state.textLocalisation}</span>
                    </motion.div>
                    <div>
                    <motion.div variants={backVariants} className="pastilleAvailable">
                      {
                      <Link href="/contact"><a><img src={state.topImageUrl} rel="preload" /></a></Link>
                      /* {textAvailable.map((letter, i) => (
                        <span key={i} className={`char${i + 1}`}>
                          {letter}
                        </span>
                      ))}
                       */}
                    </motion.div>
                    </div>
                    <a
                      onClick={scrollToTheView}
                      className="scrollTopLink"
                    >{state.textScrollTop}</a>
                    </div>
                  <motion.div
                    style={{ scale }}
                    className="homeImage">
                    <img
                      ref={refImageHome}
                      data-img={state.menuCategoryLink}
                      rel="preload"
                      src={state.logoSiteUrl}
                      width={isHomeImage < isDevice ? window.innerWidth : "100%"}
                      height="auto"
                    />
                    {/* style={{transform:`${isHomeImage < isDevice ? "transform: scale(1.4)": "transform: scale(1)"}`}} */}
                  </motion.div>
                </motion.div>
                </>
      )}
      </themeContextUser.Consumer>
    )
}

export default Hometop;