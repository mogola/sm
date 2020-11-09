

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

const Hometop = ({state = ''}) => {
    const [textAvailable, setTextAvailable] = useState([])

    useEffect(() => {
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
    }, [])

    return (
        <>
              <a className="menuB">
                <span className="mTop"></span>
                <span className="mBottom"></span>
              </a>
              <div  className="homeWrapper">
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: "100%"
                }}>
                <div className="mainHeader">
                    <div className="divHeader">
                      <h2 className={utilStyles.headingLg}>
                        <Link href="/">
                          <a className={`txtLogo ${utilStyles.colorInherit}`}>{state.nameSite}</a>
                        </Link>
                      </h2>
                    </div>
                    {state.menuCategoryLink &&
                      <div className="mainMenu">
                        <ul>
                          {state.menuCategoryLink.map((item, i) => (
                            <li key={i}>
                              <Link href={item.url}>
                                <a className="menuLink">{item.name}</a>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    }
                  </div>
                  <div className="titleBlockHome">
                    <h3>
                      {state.titleMain}
                    </h3>
                    <h3>
                      {state.subTitleImage}
                    </h3>
                    <span className="categoryTextHome">Portfolio</span>
                  </div>
                  <div className="infoContact">
                    <span className="emailUser">{state.email}</span>
                    <span className="contactUser">{state.textLocalisation}</span>
                  </div>
                  <div>
                  <div className="pastilleAvailable">
                    {textAvailable.map((letter, i) => (
                      <span key={i} className={`char${i + 1}`}>
                        {letter}
                      </span>
                    ))}
                  </div>
                  </div>
                  <a className="scrollTopLink">{state.textScrollTop}</a>
                  </div>
                <div className="homeImage">
                  <img data-img={state.menuCategoryLink} rel="preload" src={state.logoSiteUrl} width="100%" height="auto"/>
                </div>
              </div>
              </>
    )
}

export default Hometop;