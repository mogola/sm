

import { themeContextUser } from 'context/contextUser';
import Link from 'next/link'
import {useState, useEffect} from 'react'
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

const Menu = ({state = '', connect}) => {
    const [textAvailable, setTextAvailable] = useState([])
    const [isUserAdmin, setIsUserAdmin] = useState()
    const [isMobile, setIsMobile] = useState(768)
    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const [isToggle, setIsToggle] = useState(false)
    const [isBackground, setIsBackground] = useState(state.colorBackgroundMenu)
    const [isInnerWidth, setIsInnerWidth] = useState()
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
    }, [])

    return (
      <themeContextUser.Consumer>
        {({userConnected}) => (
          <div className="mainMenuNoHome">
                <a
                  className={`
                  ${isMobileMenu ? "menuBurgerMobile": "menuBurgerDesktop"} menuB
                  ${isToggle ? "isOpen" : "isClosed"}
                  `}
                  onClick={toggleMenu}
                >
                  <span className="mTop"></span>
                  <span className="mBottom"></span>
                </a>
                  <div className="contentMenu">
                  <div className="mainHeader">
                      <div className="divHeader">
                        <h2 className={`
                        ${utilStyles.headingLg}
                        ${isMobileMenu ? "activeMobileMenu": "activeDesktopMenu"}
                        ${isToggle ? "isOpen" : "isClosed"}
                        `}>
                          <Link href="/">
                            <a className={`txtLogo ${utilStyles.colorInherit}`}>{state.nameSite}</a>
                          </Link>
                        </h2>
                      </div>
                      {state.menuCategoryLink &&
                        <div
                        data-ismobile={isMobileMenu}
                        style={isMobileMenu ? {backgroundColor: isBackground} : {backgroundColor: "transparent"}}
                        className={`mainMenu ${isMobileMenu} ${isMobileMenu ? "activeMobile": "activeDesktop"} ${isToggle ? "isOpen" : "isClosed"}`}>
                          <ul>
                            {state.menuCategoryLink.map((item, i) => (
                              <li key={i}>
                                <Link href={item.url}>
                                  <a className="menuLink">{item.name}</a>
                                </Link>
                              </li>
                            ))}
                            {isUserAdmin &&
                            <>
                            <li key="ezrze">
                              <Link href="/admin/config">
                                <a className="menuLink">Manage globales</a>
                              </Link>
                            </li>
                            <li key="eaze">
                              <Link href="/admin/project">
                                <a className="menuLink">Create project</a>
                              </Link>
                            </li>
                            </>
                            }
                            {!isUserAdmin &&
                            <>
                            <li key="ezr">
                              <Link href="/login">
                                <a className="menuLink">Login</a>
                              </Link>
                            </li>
                            <li key="ezrerze">
                              <Link href="/register">
                                <a className="menuLink">register</a>
                              </Link>
                            </li>
                            </>
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
    )
}

export default Menu;