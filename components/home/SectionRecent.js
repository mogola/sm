import React from 'react'
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

import { motion } from 'framer-motion';
let easing = [0.175, 0.85, 0.42, 0.96];

const imageVariants = {
  exit: { scale: 1, opacity: 0, transition: { type: "spring", duration: 0.5, staggerChildren: 0.05} },
  enter: {
   scale: 1.5,
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

const SectionsRecent = ({title = "", data = [], isadmin, ...rest}) => {
    return(<motion.div className="motionWrapper" initial="exit" animate="enter" exit="exit">
    <Section {...rest}>
        <Container breakpoint="fullhd" fluid className="containerTitleSection">
        {title &&
            <Heading className="titleMainCategory" size={1}>
             {title}
            </Heading>
        }
        </Container>
            <Columns className="homeCategory">
            {data.map((post, i) => (
                <React.Fragment key={i}>
                    {i === 0 &&
                        <Container breakpoint="fullhd" fluid className="mainProject onTopView" key={`${i}${post._id}`}>
                        <Columns.Column className="columnProject" size={12}>
                            <motion.div variants={imageVariants} className="">
                            <Image className="mainImageCategory" loading="lazy" rounded={false} src={post.imageMainPrincipal} />
                            </motion.div>
                            <Content className="info">
                                <Tag.Group className="tagGroupPost">
                                    <Tag className="recentDate">
                                        {moment(post.date).locale('fr').format('MMMM YYYY', 'fr')}
                                        <span className="nbItem">{`0${i+1}`}</span>
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
                                    {post.listCategory.map((tag, j) => (
                                        <Tag key={`${j}${post._id}`}>{tag}</Tag>
                                    ))}
                                </Tag.Group>
                                    <motion.div className="center-category">
                                        <Image loading="lazy" className="mainImageCategory" rounded={false} src={post.imageMainPrincipal} />
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