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

const SectionsRecent = ({title = "", data = [], isadmin, ...rest}) => {
    return(<>
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
                        <Image className="mainImageCategory" rounded={false} src={post.imageMainPrincipal} />
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
                            <div className="center-category">
                                <Heading className="subTitleMainProject" size={1}>
                                {post.title}
                                </Heading>
                                <Content className="contentText">
                                    <p>
                                    {post.subTextDescription}
                                    </p>
                                </Content>
                                </div>
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
                                        {
                                            isadmin &&
                                            <Link href={{
                                                pathname:'/admin/updateproject',
                                                query:{id: post._id},
                                            }}>
                                                <a className="udpatePost">
                                                    Mettre à jour
                                                </a>
                                            </Link>
                                        }
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
                                <div className="center-category">
                                    <Image className="mainImageCategory" rounded={false} src={post.imageMainPrincipal} />
                                    </div>
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
                                                {post.subTextDescription}
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
                                            <Link href={{
                                                pathname:'/admin/updateproject',
                                                query:{id: post._id},
                                            }}>
                                                <a className="udpatePost">
                                                    Mettre à jour
                                                </a>
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
    </>)
}

export default SectionsRecent;