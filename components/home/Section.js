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

const Sections = ({title = "", data = [], ...rest}) => {
    return(<>
    <Section {...rest}>
        <Container className="containerTitleSection">
        <Heading className="titleMainCategory" size={1}>
          {title}
        </Heading>
        </Container>
        <Container>
            <Columns className="homeCategory">
            {data.map((post, i) => (
                <Columns.Column key={i} size="half">
                    <Image rounded={false} src={post.imageMainPrincipal} />
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
                    <Content className="contentText" dangerouslySetInnerHTML={{__html:post.subTextDescription}}>
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
                            <a className="linkSee">Voir le projet <span className="icoRight" width={26}></span></a>
                        </Link>
                </Columns.Column>
                ))}
            </Columns>
            <Container className="containLink">
                <Link
                    href={'/projets/[slug]'}
                    as={`/projets/recents`}>
                    <a className="linkSee getOrange">Voir tous les projets <span className="icoRight orangeSvg" width={26}></span></a>
                </Link>
            </Container>
        </Container>
    </Section>
    </>)
}

export default Sections;