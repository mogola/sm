import { themeContextUser } from './../../context/contextUser';
import Link from 'next/link'
import Image from 'next/image'
import {useState, useEffect, useRef, forwardRef} from 'react'
import Menu from './Menu'
import {motion, useMotionValue} from 'framer-motion';
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

const MainImageHome = forwardRef((props, ref) => (
  <div className="refImageHome" ref={ref}>
    {props.children}
  </div>
))

const Hometop = ({onClick, config, state = '', connect}) => {
    const [textAvailable, setTextAvailable] = useState([])
    const [isUserAdmin, setIsUserAdmin] = useState()
    const [isMobile, setIsMobile] = useState(768)
    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const [isToggle, setIsToggle] = useState(false)
    const [isBackground, setIsBackground] = useState(state.colorBackgroundMenu)
    const [isInnerWidth, setIsInnerWidth] = useState()
    const [isDevice, setIsDevice] = useState()
    const [isHomeImage, setIsHomeImage] = useState()

    console.log('state configuration', state, config)
    const scale = useMotionValue(isHomeImage < isDevice ? 1.4 : 1.2)

    const refImageHome = useRef(null)

    const viewPortDetection = () => {
        if(window.innerWidth < isMobile){
          setIsMobileMenu(true)
      }else{
        setIsMobileMenu(false)
      }
    }

    const toggleMenu = (e) => {
      e.preventDefault()
      setIsToggle(!isToggle)
    }

    const scrollToTheView = () => {
      let wrapper = document.querySelector(".homeWrapper");

      let classNameExist = wrapper.getAttribute("class");
      let verifyClassExist = classNameExist.split(" ");


      const verify = (val, arr) => {
        return arr.some((value) => value === val)
      }

      if(!verify("scrolling", verifyClassExist)){
        wrapper.setAttribute("class", `${classNameExist} scrolling`)
      }else{
      }

      window.scroll({
        top: wrapper.offsetHeight,
        behavior: 'smooth'
      })

    }
    useEffect(() => {
      setIsInnerWidth(window.innerWidth)

        setIsUserAdmin(connect)
        window.addEventListener('resize',viewPortDetection)
        viewPortDetection()

        setIsDevice(window.innerWidth)
        if(refImageHome){
          if(refImageHome.current !== null) {
            setIsHomeImage(refImageHome.current.clientWidth)
          }

        }
        console.log('state', state);
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
                      <Link href="/contact" prefetch={true}>
                        <a onClick={() => {
                          onClick()
                        }}>
                        <img src={state.topImageUrl} rel="prefetch" /></a>
                      </Link>
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
                      <MainImageHome ref={refImageHome}>
                        <Image
                          className="mainHomeGlobal"
                          src={ Object.keys(state).length === 0 ? 'https://smogola.com/_next/image?url=https%3A%2F%2Ftestbucketcreateds3.s3.amazonaws.com%2FhomeMain.jpeg&w=1920&q=75' : state.logoSiteUrl}
                          layout="fill"
                          priority={true}
                          loading='eager'
                          sizes="100vw"
                          quality={80}
                        />
                      </MainImageHome>
                    
                    {/* style={{transform:`${isHomeImage < isDevice ? "transform: scale(1.4)": "transform: scale(1)"}`}} */}
                  </motion.div>
                </motion.div>
                </>
      )}
      </themeContextUser.Consumer>
    )
}

export default Hometop;