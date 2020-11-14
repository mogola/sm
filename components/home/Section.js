import Link from 'next/link'
import moment from 'moment'
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
                    <Content className="contentText">
                        <p>
                        {post.subTextDescription}
                        </p>
                    </Content>
                        <Link href={'/project/[id]'} as={`/project/${post._id}`}>
                            <a className="linkSee">Voir le projet</a>
                        </Link>
                </Columns.Column>
                ))}
            </Columns>
            <Container className="containLink">
                <Link href="/category/project">
                    <a className="linkSee getOrange">Voir tous les projets</a>
                </Link>
            </Container>
        </Container>
    </Section>
    </>)
}

export default Sections;