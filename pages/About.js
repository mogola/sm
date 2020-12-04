import { useState, useEffect, useRef, useLayoutEffect  } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import baseUrl from '../helpers/baseUrl'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import Menu from './../components/home/Menu'
import Footer from './../components/home/Footer'
import Prestation from './../components/home/Prestation'
import {getPostConfig, getAllPosts } from './api/home'
import { Button, Container, Content, Image, Media, Card, Heading, Box, Loader, Tag, Form, Columns } from 'react-bulma-components';
const {Field, Control, Label} = Form;

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

export async function getServerSideProps() {
const getData = await fetch(`${baseUrl}/api/about`, {method:"GET"})
const data = await getData.json()
const config = await getPostConfig()
const getPostData = await getAllPosts(6)

console.log("data about", JSON.parse(JSON.stringify(data)))
console.log("post", getPostData)
return {
    props: {
      data: JSON.parse(JSON.stringify(data.data)),
      allPost:JSON.parse(JSON.stringify(getPostData)),
      config: JSON.parse(JSON.stringify(config[0])),
    }
  }
}

export default function About({post, data, config, allPost, connect}) {
const [getData, setGetData] = useState(data)
const [configs, setConfigs] = useState(config)
const [posts, setPosts] = useState(allPost)

const gridMasonry = () => {
  let grids = [...document.querySelectorAll('.containerMas')];

          if(grids.length && getComputedStyle(grids[0]).gridTemplateRows !== 'masonry') {
            grids = grids.map(grid => ({
              _el: grid,
              gap: parseFloat(getComputedStyle(grid).gridRowGap),
              items: [...grid.childNodes].filter(c => c.nodeType === 1),
              ncol: 0
            }));

            function layout() {
              grids.forEach(grid => {
                /* get the post relayout number of columns */
                  let ncol = getComputedStyle(grid._el).gridTemplateColumns.split(' ').length;

                  /* if the number of columns has changed */
                  if(grid.ncol !== ncol) {
                    /* update number of columns */
                    grid.ncol = ncol;

                    /* revert to initial positioning, no margin */
                    grid.items.forEach(c => c.style.removeProperty('margin-top'));

                    /* if we have more than one column */
                    if(grid.ncol > 1) {
                      grid.items.slice(ncol).forEach((c, i) => {
                        let prev_fin = grid.items[i].getBoundingClientRect().bottom /* bottom edge of item above */,
                            curr_ini = c.getBoundingClientRect().top /* top edge of current item */;

                        c.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`
                      })
                    }
                  }
                })
            }

            addEventListener('load', e => {
              console.log("dom ready")
              layout(); /* initial load */
              addEventListener('resize', layout, false)
            }, false);
          }
          else console.log('yay, do nothing!')
}

    useEffect(()=> {
        console.log(getData, posts)
        gridMasonry();
    }, [data])

  return (
    <Layout post>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <ToastContainer />
      <Menu
            state={config}
            connect={connect}
            classMenu="fixedMenu"
        />
      <Field className="noMarginContent">
          <Columns className="aboutMainProfil">
            <Columns.Column className="txtContentProfil">
                <Content className="textProfil"
                    dangerouslySetInnerHTML={{__html:data.description}}>
                </Content>
            </Columns.Column>
            <Columns.Column className="mainProfilImage">
                <Image src={data.urlProfilImage} />
            </Columns.Column>
          </Columns>
          <Container className="profilSubContent">
            <Columns>
                <Columns.Column className="mainListImageProfil">
                    <Content className="listImageProfil">
                        {data.getImagesPost.map((items, i) => (
                            <Image key={i} src={items} />
                        ))}
                    </Content>
                </Columns.Column>
                <Columns.Column className="profilSubText">
                    <Content>
                        <Heading className="titleAboutName" size={4}>
                            {data.titleProfilAbout}
                        </Heading>
                        <Content className="contentText"
                            dangerouslySetInnerHTML={{__html:data.descriptionProfil}}>
                        </Content>
                    </Content>
                </Columns.Column>
            </Columns>
          </Container>
          <Container className="profilSubContent">
            <Heading className="titleAboutName" size={4}>
                {data.titleLogiciel}
            </Heading>
            <Content className="listTools">
                {data.listLogiciel.map((item, i) => (
                    <span key={i}>{item}</span>
                ))}
            </Content>
          </Container>

          <div className="containerMas">
          <img src='https://images.unsplash.com/photo-1510137600163-2729bc6959a6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=900&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1587041403375-ddce288f4c49?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1580697895575-883f7c755346?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1581200459935-685903de7d62?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1578264050450-ccc2f77796a1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1557153921-10129d0f5b6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1584049086295-9f2af90efbb4?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1572196663741-b91b8f045330?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1558288215-664da65499af?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1592296109897-9c4d8e490e7a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1525104885119-8806dd94ad58?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1576532116216-84f6a0aedaf6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1533629947587-7b04aaa0e837?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1568386895623-74df8a7406f0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1573777058681-73b866833d90?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1552566852-06d10a5050f4?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1576759470820-77a440a4d45b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1586891622678-999a4419da34?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1584797318381-5958ca2e6b39?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1529093589387-b486dcc37c15?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1587421803669-b403d010dd80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1570458436416-b8fcccfe883f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
  <img src='https://images.unsplash.com/photo-1518206245806-5c1f4d0c5a2a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='black cat'/>
          </div>
        </Field>
        <Prestation
          data={configs.textContentServices}
          title={configs.textCategoryServices}
          className="section-prestation"
        />
        <Footer
          menu={configs.menuCategoryLink}
          data={configs}
          className="section-footer"
        />
    </Layout>
  )
}